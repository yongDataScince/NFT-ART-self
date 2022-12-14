import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as ethers from 'ethers'
import ABI from './abi.json'
import collections from '../assets/data/collections.json'
import authors from '../assets/data/authors.json'

export interface Author {
  id?: number,
  name?: string,
  avatar?: string,
  address?: string,
  collections?: number[],
  social?: any,
  description?: any
}

export interface ICollection {
  id: number,
  contract: ethers.Contract,
  address: string,
  name: string,
  totalSupply: number,
  symbol: string,
  authors: Author[],
}

interface ContractState {
  provider?: ethers.providers.Provider,
  collections?: ICollection[],
  signer?: ethers.providers.JsonRpcSigner,
  loading: boolean,
  tokens?: any[],
  currToken?: any,
  totalSupply?: number,
  signerAddress?: string;
  haveEth?: boolean;
  signerBalance?: number;
  needChain?: boolean;
  userPictures?: any[];
  lastCheck?: number,
}

export const getPicturesByCollection = (collectionAddress: string) => {
  let i = 0;
  let totalSupply = 0;
  while (true) {
    try {
      const data = require(`../assets/jsons_test/${i}.json`)
      if (data.collection_address === collectionAddress) {
        totalSupply += 1;
      }
    } catch (error) {
      break;
    }

    i++;
  }
  return [totalSupply]
}

export const getAuthorByAddress = (address: string): Author | undefined => {
  return authors?.find((a) => {
    return a.address === address
  })
}

export const getAuthorById = (id: number): Author | undefined => {
  return authors?.find((a) => {
    return a.id === id
  })
}


export const getPictureById = (tokenId: number) => {
  let tokenInfo: any;

  try {
    tokenInfo = require(`../assets/jsons_test/${tokenId}.json`);
  } catch (error) {}

  const tokenCollectionAddress = tokenInfo.collection_address
  const collectionId =  collections.findIndex(({ address }) =>  tokenCollectionAddress) + 1;
  if (tokenInfo) {
    return {
      ...tokenInfo,
      tokenId,
      collectionId,
      path: require(`../assets/images/${tokenId}.jpg`)
    }
  }
}

export const tokenById = async ( tokenId: number, contract: ethers.Contract ) => {
  try {
    let data: any = {};
    const tokenPrice = (await contract.getTokenPrice(tokenId))?.toString()
    const tokenOwner = await contract.ownerOf(tokenId)
    const tokenStatus = (await contract.getLotState(tokenId)).toNumber()
    try {
      data = require(`../assets/jsons_test/${tokenId}.json`)
      data = {
        ...data,
        attributes: data.attributes.map((val: any) => ({
          [val.trait_type.toLocaleLowerCase()]:  val.value
        })).reduce((prev: any, curr: any) => ({ ...prev, ...curr }), {})
      }
    } catch (error) {
      console.log("Not found");
    }

    return {
      tokenData: data,
      tokenPrice: tokenPrice || "0",
      tokenOwner,
      tokenStatus,
      status: tokenStatus === 3 ? 'listed' : 'not listed'
    }
  } catch (e) {
    let data: any = {};
    try {
      data = require(`../assets/jsons_test/${tokenId}.json`)
      data = {
        ...data,
        attributes: data.attributes.map((val: any) => ({
          [val.trait_type.toLocaleLowerCase()]:  val.value
        })).reduce((prev: any, curr: any) => ({ ...prev, ...curr }), {})
      }
    } catch (error) {
      throw new Error("not found");
    }
    const tokenPrice = await contract.mintPrices(tokenId)

    return {
      tokenData: data,
      status: 'not minted',
      tokenPrice: tokenPrice || "0"
    }
  }
}

export const initContract = createAsyncThunk(
  'web3/initContract',
  async ({ haveEth, netConnected = false }: { haveEth: boolean, netConnected?: boolean }) => {
    if (haveEth) {
      let provider: ethers.providers.Web3Provider | undefined;
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(137).toString(16)}` }]
        });
        netConnected = true
      } catch (err: any) {
        if (err.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Poligon',
                  chainId: `0x${Number(137).toString(16)}`,
                  nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                  rpcUrls: ['https://polygon-rpc.com']
                }
              ]
            });
            provider = new ethers.providers.Web3Provider((window as any).ethereum);
            netConnected = true
          } catch (error) {
            console.log("cancel");
          }
        }
      }
      if (netConnected) {
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
      }
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const signerAddress = await signer?.getAddress()
        const signerBalance = Number(ethers.utils.formatEther(await provider.getBalance(signerAddress)))
        const colls: ICollection[] = [];

        for await (const collection of collections) {
          const contract = new ethers.Contract(collection.address, ABI, signer)

          const name = await contract?.name()
          const symbol = await contract?.symbol()

          const authors = (await contract?.getAuthors()).length > 0 ?
              (await contract?.getAuthors())?.map(getAuthorByAddress)
                :
              (collection as any).authors.map(getAuthorById)

          const [totalSupply] = getPicturesByCollection(collection.address)
          colls.push({
            id: collection.id,
            name,
            symbol,
            address: collection.address,
            contract: contract,
            authors,
            totalSupply
          })
        }
        
        return {
          provider,
          signerBalance,
          signer,
          signerAddress,
          colls,
          haveEth
        }
      } else {
        return {
          haveEth: true,
          needChain: true
        }
      }
    } else {      
      const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com')
      const colls: ICollection[] = [];

      for await (const collection of collections) {
        const contract = new ethers.Contract(collection.address, ABI, provider)
        const name = await contract?.name()
        const symbol = await contract?.symbol()
        console.log(await contract?.getAuthors());
        
        const authorsArr = (await contract?.getAuthors()).length > 0 ?
          (await contract?.getAuthors())?.map(getAuthorByAddress)
            :
          (collection as any).authors.map(getAuthorById)

        const [totalSupply] = getPicturesByCollection(collection.address)
        colls.push({
          id: collection.id,
          name,
          symbol,
          address: collection.address,
          contract: contract,
          totalSupply,
          authors: authorsArr
        })
      }

      return {
        provider,
        colls,
        haveEth
      }
    }
  }
)

export const tokenInfo = createAsyncThunk(
  'web3/tokenInfo',
  async (
    { tokenId, collectionId }: { tokenId: number, collectionId: number },
    { getState }: any
  ) => {
    const { web3 }: any = getState()
    const { contract: collection } = await web3?.collections?.find((collection: any) => collection.id === collectionId); 

    try {
      const { tokenData } = await tokenById(tokenId, collection)
      const tokenPrice = (await collection?.getTokenPrice(tokenId))?.toString()
      const tokenOwner = await collection?.ownerOf(tokenId)
      const tokenStatus = (await collection?.getLotState(tokenId)).toNumber()
      const tokenPrevOwner = (await collection.tokensPreviousOwner(tokenId))
      
      const tokenCurrToken = tokenStatus === 3 ? tokenPrevOwner : tokenOwner

      return {
        tokenData,
        tokenPrice: tokenPrice || "0",
        tokenCurrToken,
        tokenStatus,
        status: tokenStatus === 3 ? 'available' : 'not available'
      }
    } catch (e) {
      const { tokenData } = await tokenById(tokenId, collection)
      const tokenPrice = await collection.mintPrices(tokenId)
      return {
        tokenData,
        status: 'not minted',
        tokenPrice: tokenPrice || "0"
      }
    }
  }
);

export const tokenInfos = createAsyncThunk(
  'web3/tokensInfo',
  async (
    { collectionId }: { collectionId: number },
    { getState }: any
  ) => {
    console.log('token infos');
    const { web3 }: any = getState()
    const { contract: collection } = await web3?.collections?.find((collection: any) => collection.id === collectionId); 

    const tokens = []

    let id = 0;
    while(true) {
      try {
        const data = await tokenById(id, collection);
        try {
          const tokenPrice = (await collection?.getTokenPrice(id))?.toString()
          const tokenOwner = await collection?.ownerOf(id)
          const tokenStatus = (await collection?.getLotState(id)).toNumber()
          const tokenPrevOwner = (await collection.tokensPreviousOwner(id))
          const tokenCurrTokenOwner = tokenStatus === 3 ? tokenPrevOwner : tokenOwner
          
          tokens.push({
            name: data.tokenData?.name,
            id,
            tokenPrice,
            tokenCurrTokenOwner,
            tokenOwner,
            tokenStatus,
            status: tokenStatus === 3 ? 'available' : 'sold'
          })
        } catch (e) {
          tokens.push({
            name: data.tokenData?.name,
            id,
            status: 'not minted'
          })
        }
      } catch (error) {
        break;
      }

      id += 1;
    }
    return tokens
  }
)

export const buyToken = createAsyncThunk(
  'web3/buyToken',
 async ({ tokenId, collectionId }:{
  tokenId: number,
  collectionId: number
 }, {
  getState
 }) => {
  const { web3 }: any = getState()
  const { contract: collection } = await web3?.collections?.find((collection: any) => collection.id === collectionId); 
  const tokenPrice = (await collection?.getTokenPrice(tokenId))
  const tx = await collection?.buyToken(tokenId, { value: tokenPrice })
  await tx.wait()
 }
)

export const revokeToken = createAsyncThunk(
  'web3/revoke',
  async ({ tokenId, collectionId }:{
    tokenId: number,
    collectionId: number
   }, {
    getState
   }) => {
    const { web3 }: any = getState()
    const { contract: collection } = await web3?.collections?.find((collection: any) => collection.id === collectionId); 
    const tx = await collection?.revokeToken(tokenId)
    await tx.wait()
   }
)

export const listToken = createAsyncThunk(
  'web3/listToken',
 async ({
  tokenId,
  newPrice,
  validate,
  collectionId
 }: {tokenId: number, newPrice: string, validate: boolean, collectionId: number}, {
  getState
 }) => {
  const { web3 }: any = getState()
  const { contract: collection } = await web3?.collections?.find((collection: any) => collection.id === collectionId); 
  const tx = await collection?.listToken(tokenId, ethers.utils.parseEther(newPrice), validate)
  await tx.wait()
 }
)

export const mintToken = createAsyncThunk(
  'web3/mint',
  async ({ tokenId, collectionId }:{ tokenId: number, collectionId: number }, { getState }) => {
  const { web3 }: any = getState()
  const { contract: collection } = await web3?.collections.find((collection: any) => collection.id === collectionId); 

  const tx = await collection.mint([tokenId], {
    value: await collection.mintPrices(tokenId)
  })

  await tx.wait()
 }
)

export const settingsCall = createAsyncThunk(
  'web3/settingsCall',
  async ({ method, contract, args }:{ method: string, contract: ethers.Contract, args: any[] }) => {
    if (contract[method]) {
      console.log(method, args);
      
      const tx = await contract[method](...args)
      await tx.wait()
    }
  }
)

export const userTokens = createAsyncThunk(
  'web3/user-tokens',
  async (signer: ethers.providers.JsonRpcSigner) => {
    const collectionAddresses = collections.map((c) => c.address)
    const userTokens = []
    const signerAddress = await signer?.getAddress()

    for await (const address of collectionAddresses) {
      const Collection = new ethers.Contract(address, ABI, signer)
      const coll = await Collection.attach(address)
      const maxSupply = (await coll.maxSupply()).toNumber()

      for (let id = 0; id < maxSupply; id++) {
        let owner: string = '';
        const statusNum = (await coll.getLotState(id)).toNumber();
        try {
          if (await coll.tokensPreviousOwner(id) !== '0x0000000000000000000000000000000000000000') {
            owner = statusNum === 0 ? await coll.ownerOf(id) : await coll.tokensPreviousOwner(id)
          } else {
            owner = await coll.ownerOf(id)
          }
        } catch (error) {
          owner = ''
        }

        if (owner === signerAddress) {
          const info = getPictureById(id)

          userTokens.push({
            ...await tokenById(id, coll),
            ...info
          }) 
        }
      }
    }

    return userTokens
  }
)

const initialState: ContractState = {
  loading: false,
  haveEth: true,
  needChain: false,
}

export const contractSlice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setLoader: (state, {payload}: PayloadAction<boolean>) => {
      state.loading = payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(revokeToken.pending, (state) => {
      state.loading = true
    })
    builder.addCase(revokeToken.rejected, (state, { error }) => {
      state.loading = false
      console.log(error);
    })
    builder.addCase(revokeToken.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(userTokens.pending, (state) => {
      state.loading = true
    })
    builder.addCase(userTokens.rejected, (state, { error }) => {
      state.loading = false
      console.log(error);
    })
    builder.addCase(userTokens.fulfilled, (state, { payload }) => {      
      state.userPictures = payload;
      console.log(payload);
      state.loading = false
      if (payload.length === 0) {
        state.userPictures = [{ info: "no" }]
      }
    })
    builder.addCase(initContract.rejected, (state, { error }) => {
      console.error('`initContract` error:', error);
      state.loading = false
    });
    builder.addCase(initContract.pending, (state) => {
      state.loading = true
    });
    builder.addCase(initContract.fulfilled, (state, { payload }) => {
      state.needChain = !!payload.needChain
      state.provider = payload.provider
      state.signer = payload.signer
      state.userPictures = []
      state.collections = payload.colls as any
      state.loading = false
      state.signerBalance = payload.signerBalance
      state.signerAddress = payload.signerAddress
      state.haveEth = payload.haveEth
    });
    builder.addCase(tokenInfo.rejected, (state, { error }) => {
      state.loading = false;

      state.currToken = {
        status: 'not minted',
        image: 'placeholder'
      }
    });
    builder.addCase(tokenInfo.pending, (state) => {
      state.loading = true
    });
    builder.addCase(tokenInfo.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currToken = payload
    });
    builder.addCase(buyToken.pending, (state) => {
      state.loading = true
    })
    builder.addCase(buyToken.rejected, (state, {error}) => {
      state.loading = false
      console.log('buyToken', error.message);
    })
    builder.addCase(buyToken.fulfilled, (state) => {})
    
    builder.addCase(listToken.pending, (state) => {
      state.loading = true
    })
    builder.addCase(listToken.rejected, (state, {error}) => {
      state.loading = false
      console.log('listToken', error.message);
    })
    builder.addCase(listToken.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(mintToken.pending, (state) => {
      state.loading = true
      console.log("mintToken pending");
    })
    builder.addCase(mintToken.rejected, (state, { error }) => {
      state.loading = false
      console.log(error);
    })
    builder.addCase(mintToken.fulfilled, (state) => {
      state.loading = false
      console.log("mintToken fulfilled");
    }) 
    builder.addCase(tokenInfos.pending, (state) => {
      state.loading = true
    })
    builder.addCase(tokenInfos.fulfilled, (state, { payload }) => {
      state.lastCheck = Date.now()
      state.loading = false
      state.tokens = payload
    })

    builder.addCase(settingsCall.pending, (state) => {
      state.loading = true
    })
    
    builder.addCase(settingsCall.rejected, (state, { error }) => {
      state.loading = false
      console.log(error);
    })

    builder.addCase(settingsCall.fulfilled, (state) => {
      state.loading = false
      window.location.reload();
    })
  },
})

export const { setLoader } = contractSlice.actions;

export default contractSlice.reducer;