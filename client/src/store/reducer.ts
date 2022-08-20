import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as ethers from 'ethers'
import ABI from './abi.json'
import collections from '../assets/data/collections.json'
import authors from '../assets/data/authors.json'
import pictures from '../assets/data/pictures.json'

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
  authors: Author[]
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
  signerBalance?: number
}

export const getAuthorByAddress = (address: string): Author | undefined => {
  return authors.find((a) => a.address === address)
}

export const initContract = createAsyncThunk(
  'web3/initContract',
  async ({ haveEth }: { haveEth: boolean }) => {  
    if (haveEth) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(97).toString(16)}` }]
        });
      } catch (err: any) {
        console.log(err);
        if (err.code === 4902) {
          console.log('init');
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'binance test',
                chainId: `0x${Number(97).toString(16)}`,
                nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                rpcUrls: ['https://data-seed-prebsc-2-s2.binance.org:8545/']
              }
            ]
          });
        }
      }

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signerAddress = await signer?.getAddress()
      const signerBalance = Number(ethers.utils.formatEther(await provider.getBalance(signerAddress)))
      const colls: ICollection[] = [];

      for await (const collection of collections) {
        const contract = new ethers.Contract(collection.address, ABI, signer)
        const totalSupply = pictures.length + 1
        const name = await contract?.name()
        const symbol = await contract?.symbol()
        const authors = !!(await contract?.getAuthors())?.map(getAuthorByAddress).length ?
            (await contract?.getAuthors())?.map(getAuthorByAddress)
              :
            (collection as any).authors.map(getAuthorByAddress)
        colls.push({
          id: collection.id,
          name,
          symbol,
          address: collection.address,
          contract: contract,
          totalSupply,
          authors
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
      const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
      const colls: ICollection[] = [];

      for await (const collection of collections) {
        const contract = new ethers.Contract(collection.address, ABI, provider)
        const totalSupply = pictures.length
        const name = await contract?.name()
        const symbol = await contract?.symbol()
        const authors = !!(await contract?.getAuthors())?.map(getAuthorByAddress).length ?
                (await contract?.getAuthors())?.map(getAuthorByAddress)
                  :
                (collection as any).authors.map(getAuthorByAddress)
        colls.push({
          id: collection.id,
          name,
          symbol,
          address: collection.address,
          contract: contract,
          totalSupply,
          authors
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
    const { contract: collection } = await web3?.collections.find((collection: any) => collection.id === collectionId); 

    try {
      const tokenPrice = (await collection?.getTokenPrice(tokenId))?.toString()
      const tokenOwner = await collection?.ownerOf(tokenId)
      const tokenStatus = (await collection?.getLotState(tokenId)).toNumber()
      return {
        tokenPrice: tokenPrice || "0",
        tokenOwner,
        tokenStatus,
        status: tokenStatus === 0 ? 'available' : 'not available'
      }
    } catch (e) {
      const tokenPrice = await collection.mintPrices(tokenId)
      return {
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
    const { web3 }: any = getState()
    const { contract: collection } = await web3?.collections.find((collection: any) => collection.id === collectionId); 

    const tokens = []

    for await (const pic of pictures) {
      try {
        const tokenPrice = (await collection?.getTokenPrice(pic.tokenId))?.toString()
        const tokenOwner = await collection?.ownerOf(pic.tokenId)
        const tokenStatus = (await collection?.getLotState(pic.tokenId)).toNumber()
        tokens.push({
          name: pic.name,
          id: pic.tokenId,
          tokenPrice,
          tokenOwner,
          tokenStatus,
          status: tokenStatus === 0 ? 'available' : 'not available'
        })
      } catch (e) {
        tokens.push({
          name: pic.name,
          id: pic.tokenId,
          status: 'not minted'
        })
      }
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
  const { contract: collection } = await web3?.collections.find((collection: any) => collection.id === collectionId); 
  const tokenPrice = (await collection?.getTokenPrice(tokenId))
  const tx = await collection?.buyToken(tokenId, { value: tokenPrice })
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
  const { contract: collection } = await web3?.collections.find((collection: any) => collection.id === collectionId); 
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

const initialState: ContractState = {
  loading: false
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
    builder.addCase(initContract.rejected, (state, { error }) => {
      console.error('`initContract` error:', error);
      state.loading = false
    });
    builder.addCase(initContract.pending, (state) => {
      state.loading = true
    });
    builder.addCase(initContract.fulfilled, (state, { payload }) => {
      state.provider = payload.provider
      state.signer = payload.signer
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
    
    builder.addCase(buyToken.fulfilled, (state) => {
      state.loading = false
    })

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
      state.loading = false
      state.tokens = payload
    })
  },
})

export const { setLoader } = contractSlice.actions;

export default contractSlice.reducer;