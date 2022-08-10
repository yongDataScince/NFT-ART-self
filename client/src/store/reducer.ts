import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as ethers from 'ethers'
import ABI from './abi.json'
import axios from 'axios'
import collections from '../assets/data/collections.json'
import authors from '../assets/data/authors.json'
import * as _ from 'lodash'

interface Author {
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
}

export const getAuthorByAddress = (address: string): Author | undefined => {
  return authors.find((a) => a.address === address)
}

export const initContract = createAsyncThunk(
  'web3/initContract',
  async ({ haveEth }: { haveEth: boolean }) => {  
    if (haveEth) {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(97).toString(16)}` }],
      })
        
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signerAddress = await signer?.getAddress()

      const colls: ICollection[] = [];

      for await (const collection of collections) {
        const contract = new ethers.Contract(collection.address, ABI, signer)
        const totalSupply = (await contract?.totalSupply())?.toNumber() || 0
        const name = await contract?.name()
        const symbol = await contract?.symbol()
        const authors = (await contract?.getAuthors())?.map(getAuthorByAddress)
        console.log(authors);
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
        const totalSupply = (await contract?.totalSupply())?.toNumber() || 0
        const name = await contract?.name()
        const symbol = await contract?.symbol()
        const authors = (await contract?.getAuthors())?.map(getAuthorByAddress)
        console.log(authors);
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

    const uri = await collection?.tokenURI(tokenId);
    const { data } = await axios.get(uri?.replace("ipfs://", uri))
    const tokenPrice = (await collection?.getTokenPrice(tokenId))?.toString()
    const tokenOwner = await collection?.ownerOf(tokenId)
    const tokenStatus = (await collection?.getLotState(tokenId)).toNumber()
  
    return {
      ...data,
      price: tokenPrice,
      owner: tokenOwner,
      status: tokenStatus === 0 ? 'not listed' : 'listed'
    }
  }
);

export const getTokens = createAsyncThunk(
  'web3/tokens',
  async (contract?: ethers.Contract) => {
    const maxSupply = (await contract?.maxSupply())?.toNumber() || 0
    const tokens = []
    console.log(contract);
    const baseUri = await contract?.baseTokenURI();
  
    if (baseUri) {
      for await (const id of _.times(maxSupply)) {
        let uri;
        console.log('base Uri:', baseUri?.replace("ipfs://", baseUri) + (id + 1));
        try {
          uri = await contract?.tokenURI(id + 1);
        } catch (error) {
          uri = baseUri?.replace("ipfs://", baseUri) + (id + 1)
        }
        if(uri) {
          let data;
          try {
            const res = await axios.get(uri?.replace("ipfs://", uri))
            data = res.data;
          } catch (error) {
            data = {}
          }
          const price = (await contract?.getTokenPrice(id + 1))?.toString()
          tokens.push({
            ...data,
            id: id + 1,
            price,
          })
        }
      }
    }

    return tokens
  }
)

export const buyToken = createAsyncThunk(
  'web3/buyToken',
 async (tokenId: number, {
  getState
 }) => {
  const { web3 }: any = getState()
  const tokenPrice = (await web3?.contract?.getTokenPrice(tokenId))
  const tx = await web3?.contract?.buyToken(tokenId, { value: tokenPrice })
  await tx.wait()
 }
)

export const listToken = createAsyncThunk(
  'web3/listToken',
 async ({
  tokenId,
  newPrice,
  validate
 }: {tokenId: number, newPrice: string, validate: boolean}, {
  getState
 }) => {
  const { web3 }: any = getState()
  const tx = await web3?.contract?.listToken(tokenId, ethers.utils.parseEther(newPrice), validate)
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
      state.signerAddress = payload.signerAddress
      state.haveEth = payload.haveEth
    });

    builder.addCase(tokenInfo.rejected, (state, { error }) => {
      console.log('`tokenInfo` error:', error);
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

    builder.addCase(getTokens.pending, (state) => {
      state.loading = true;
    })

    builder.addCase(getTokens.rejected, (state, { error }) => {
      state.loading = false
      console.log(`getTokens error: `, error);
    })

    builder.addCase(getTokens.fulfilled, (state, { payload }) => {
      state.loading = false;  
      state.tokens = payload
    })

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
  },
})

export const { setLoader } = contractSlice.actions;

export default contractSlice.reducer;