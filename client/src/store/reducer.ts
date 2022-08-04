import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as ethers from 'ethers'
import ABI from './abi.json'
import axios from 'axios'
import * as _ from 'lodash'

interface ContractState {
  provider?: ethers.providers.Provider,
  contract?: ethers.Contract,
  signer?: ethers.providers.JsonRpcSigner,
  loading: boolean,
  tokens?: any[],
  currToken?: any,
  totalSupply?: number,
  signerAddress?: string;
  haveEth?: boolean;
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
      const contract = new ethers.Contract('0x3FD0E2d4174e33ECf9B617F31238de46aD6737ac', ABI, signer)
      const totalSupply = (await contract?.totalSupply())?.toNumber() || 0
      
      return {
        provider,
        signer,
        signerAddress,
        contract,
        totalSupply,
        haveEth
      }
    } else {
      const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
      const contract = new ethers.Contract('0x3FD0E2d4174e33ECf9B617F31238de46aD6737ac', ABI, provider)
      return {
        provider,
        contract,
        haveEth
      }
    }
  }
)

export const tokenInfo = createAsyncThunk(
  'web3/tokenInfo',
  async (
    tokenId: number,
    { getState }: any
  ) => {
    const { web3 }: any = getState()
    const uri = await web3?.contract?.tokenURI(tokenId);
    const { data } = await axios.get(uri?.replace("ipfs://", uri))
    const tokenPrice = (await web3?.contract?.getTokenPrice(tokenId))?.toString()
    const tokenOwner = await web3?.contract?.ownerOf(tokenId)
    const tokenStatus = (await web3?.contract?.getLotState(tokenId)).toNumber()
  
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
      state.contract = payload.contract as any
      state.totalSupply = payload.totalSupply
      state.loading = false
      state.signerAddress = payload.signerAddress
      state.haveEth = payload.haveEth
    });

    builder.addCase(tokenInfo.rejected, (state, { error }) => {
      console.log('`tokenInfo` error:', error);
      state.loading = false;
      state.currToken = {
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