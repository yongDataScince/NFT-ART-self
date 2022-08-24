import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CopyIcon from "../../components/UI/icons/CopyIcon";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../store";
import { settingsCall, userTokens } from "../../store/reducer";
import * as Styled from './styles'

const zeroPad = (num: number, places: number = 4) => String(num).padStart(places, '0')

export const SettingsPage: React.FC = () => {
  const { collections, signerAddress, signer, userPictures, loading, haveEth } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isValidator, setIsValidator] = useState<boolean>(false)
  const [isPlatform, setIsPlatform] = useState<boolean>(false)
  
  const [feeAddress, setFeeAddress] = useState<string>('')
  const [platformAddress, setPlatformAddress] = useState<string>('')
  const [startSale, setStartSale] = useState<boolean>(false)
  const [startPresale, setStartPresale] = useState<boolean>(false)
  const [royaltyDistribution, setRoyaltyDistribution] = useState<string>('')
  const [fiatRate, setFiatRate] = useState<string>('')
  const [verifyToken, setVerifyToken] = useState<string>('')
  const [transactionNumber, setTransactionNumber] = useState<string>('')

  const [sellFeePercentage, setSellFeePercentage] = useState<string>('')
  const [mintFeePercentage, setMintFeePercentage] = useState<string>('')
  const [newAdmin, setNewAdmin] = useState<string>('')
  const [oldAdmin, setOldAdmin] = useState<string>('')
  const [newValidator, setNewValidator] = useState<string>('')
  const [oldValidator, setOldValidator] = useState<string>('')
  const [addressesStr, setAddressesStr] = useState<string>('')
  const [distributionAuthors, setDistributionAuthors] = useState<string>('')
  const [addresses, setAddresses] = useState<string[]>([])
  const [baseUri, setBaseUri] = useState<string>('')
  const [maxSupply, setMaxSupply] = useState<string>('')
  const [realMinterAuthority, setRealMinterAuthority] = useState<number>(0)
  const [realAuthorAuthority, setRealAuthorAuthority] = useState<number>(0)

  const [maxPresaleMaxSupply, setPresaleMaxSupply] = useState<string>('')
  const [preSaleMaxMint, setPreSaleMaxMint] = useState<string>('')
  const [preSalePerMaxMint, setPreSalePerMaxMint] = useState<string>('')
  const [minterAuthority, setMinterAuthority] = useState<string>('')
  const [authorRoyalty, setAuthorRoyalty] = useState<string>('')
  const [idsStr, setIdsStr] = useState<any>({
    presale: '',
    sale: ''
  })

  const [ids, setIds] = useState<any>({
    presale: [],
    sale: []
  })
  const [pricesStr, setPricesStr] = useState<any>({
    presale: '',
    sale: ''
  })
  const [prices, setPrices] = useState<any>({
    presale: [],
    sale: []
  })

  const parseAddresses = (value: string) => {
    setAddressesStr(value)
    setAddresses(
      value.replace(' ', '').split(',')
    )
  }

  const parseIds = (value: string, name: string) => {
    if (value === '') {
      setIdsStr({
        ...idsStr,
        [name]: ""
      })
      setIds({
        ...prices,
        [name]: []
      })
    }
    else if(value.match(/^[0-9, \b]+$/)) {
      setIdsStr({
        ...idsStr,
        [name]: value
      })
      setIds({
        ...ids,
        [name]: value.replace(' ', '').split(',').map((id) => Number(id))
      })
    }
  }

  const parsePrices = (value: string, name: string) => {
    if (value === '') {
      setPricesStr({
        ...idsStr,
        [name]: ""
      })
      setPrices({
        ...prices,
        [name]: []
      })
    }
    else if(value.match(/^[0-9., \b]+$/)) {
      setPricesStr({
        ...idsStr,
        [name]: value
      })

      setPrices({
        ...prices,
        [name]: value.replace(/\s/g, '').split(',').filter((val) => val.length > 0).map((id) => ethers.utils.parseEther(String(id).replace(" ", '')))
      })
    }
  }

  const call = (method: string, value: any[]) => {
    if (collections) {
      dispatch(settingsCall({
        method,
        contract: collections[0].contract,
        args: value
      }))
    }
  }

  useEffect(() => {
    dispatch(userTokens(signer as any))

    collections?.[0].contract.owner().then((data: string) => {
      setIsOwner(signerAddress === data)
    })
    collections?.[0].contract.platformAddress().then((addr: string) => setIsPlatform(addr === signerAddress))
  
    collections?.[0].contract.isAdmin(signerAddress).then(setIsAdmin)
    collections?.[0].contract.isValidator(signerAddress).then(setIsValidator)
    
    collections?.[0].contract.startSale().then(setStartSale)
    collections?.[0].contract.startPresale().then(setStartPresale)
    
  }, [collections, dispatch, signer, signerAddress])

  /// @CHECK: format for persent 1% == 100, 0.01% * 100 == 1; 42.51 === 4251
  useEffect(() => {
    if(!haveEth) navigate('/')
  }, [haveEth, navigate])

  return (
    <Styled.SettingsMain>
      <Loader show={loading} />
      <Styled.Address>
        <CopyIcon color="#888789" />
        {signerAddress?.slice(0, 5)}...{signerAddress?.slice(37, 42)}
      </Styled.Address>

      <Styled.SettingsPh>
        My purchased art [{userPictures?.length}]
      </Styled.SettingsPh>

      <Styled.SettingsPictures>
        {
          (userPictures?.length || 0) > 0 ? (
            !userPictures?.[0]?.info ? (
              userPictures?.map((pic) => (
                <Styled.Picture key={pic.tokenId} onClick={() => navigate(`/collection/${pic.collectionId}/picture/${pic.tokenId}`)}>
                  <Styled.PictureImage src={pic.path} />
                  <Styled.PictureFooter>
                    <Styled.PictureTitle>
                     <span>#{zeroPad(pic.tokenId)}</span> {pic?.name}
                    </Styled.PictureTitle>
                    <Styled.PictureStatus status={pic.status}>
                      {pic.status}
                    </Styled.PictureStatus>
                  </Styled.PictureFooter>
                </Styled.Picture>
              ))
            ) : <Styled.SettingsPageInfo>You're not have any tokens</Styled.SettingsPageInfo>
          ) : <Styled.SettingsPageInfo>Wait Please...</Styled.SettingsPageInfo>
        }

      </Styled.SettingsPictures>
      {
        isOwner && 
        <>
          <Styled.SettingsPageTitle>Owner</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Add admin</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new admin address" value={newAdmin} onChange={(e) => setNewAdmin(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('addAdmin', [newAdmin])}>Add</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Remove admin</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="remove admin address" value={oldAdmin} onChange={(e) => setOldAdmin(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('removeAdmin', [oldAdmin])}>Remove</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Add to presale</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="addresses" value={addressesStr} onChange={(e) => parseAddresses(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('addToPresale', [addresses])}>Add</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Add validator</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new validator address" value={newValidator} onChange={(e) => setNewValidator(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('addValidator', [newValidator])}>Add</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Remove validator</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="validator address" value={oldValidator} onChange={(e) => setOldValidator(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('removeValidator', [oldValidator])}>Remove</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change presale mint price</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="prices (in MATIC): 1.0, 2.2, 3.7..." value={pricesStr['presale']} onChange={(e) => (e.target.value.match(/^[0-9., \b]+$/) || e.target.value === "") && parsePrices(e.target.value, 'presale')}  />
            <Styled.SettingsInput placeholder="ids" value={idsStr['presale']} onChange={(e) => parseIds(e.target.value, 'presale')} />
            <Styled.SettingsButton onClick={() => call('changePresaleMintPrice', [
              idsStr['presale'], prices['presale']
            ])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change mint price</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="prices (in MATIC): 1.0, 2.2, 3.7..." value={pricesStr['sale']} onChange={(e) => (e.target.value.match(/^[0-9., \b]+$/) || e.target.value === "") && parsePrices(e.target.value, 'sale')} />
            <Styled.SettingsInput placeholder="ids" value={idsStr['sale']} onChange={(e) => parseIds(e.target.value, 'sale')} />
            <Styled.SettingsButton onClick={() => call('changeMintPrice', [
              idsStr['sale'], prices['sale']
            ])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set base uri</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new base uri" value={baseUri} onChange={(e) => setBaseUri(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setBaseURI', [baseUri])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set max supply</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new max supply" value={maxSupply} onChange={(e) => (e.target.value.match(/^[0-9\b]+$/) || e.target.value === "") && setMaxSupply(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setMaxSupply', [maxSupply])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set presale max mint</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="max mint" value={preSaleMaxMint} onChange={(e) => (e.target.value.match(/^[0-9\b]+$/) || e.target.value === "") && setPreSaleMaxMint(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setPresaleMaxMint', [preSaleMaxMint])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set presale max per mint</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="max per mint" value={preSalePerMaxMint} onChange={(e) => (e.target.value.match(/^[0-9\b]+$/) || e.target.value === "") && setPreSalePerMaxMint(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setPresaleMaxPerMint', [preSalePerMaxMint])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set presale max supply</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="presale max supply" value={maxPresaleMaxSupply} onChange={(e) => (e.target.value.match(/^[0-9\b]+$/) || e.target.value === "") && setPresaleMaxSupply(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setPresaleMaxSupply', [maxPresaleMaxSupply])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Toggle presale started</Styled.SettinsBlockTitle>
            <Styled.ButtonGroup>
              <Styled.SettingsButton onClick={() => call('togglePresaleStarted', [])} disabled={startPresale}>On</Styled.SettingsButton>
              <Styled.SettingsButton onClick={() => call('togglePresaleStarted', [])} disabled={!startPresale}>Off</Styled.SettingsButton>
            </Styled.ButtonGroup>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Toggle public sale started</Styled.SettinsBlockTitle>
            <Styled.ButtonGroup>
              <Styled.SettingsButton onClick={() => call('togglePresaleStarted', [])} disabled={startSale}>On</Styled.SettingsButton>
              <Styled.SettingsButton onClick={() => call('togglePresaleStarted', [])} disabled={!startSale}>Off</Styled.SettingsButton>
            </Styled.ButtonGroup>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Renounce ownership</Styled.SettinsBlockTitle>
            <Styled.SettingsButton  onClick={() => call('renounceOwnership', [])}>Renounce</Styled.SettingsButton>
          </Styled.SettinsBlock>
        </>
      }
      {
        isAdmin &&
        <>
          <Styled.SettingsPageTitle>Admin</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change minter royalty</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="for ex.: 0.01 ... 5.0" value={minterAuthority} onChange={(e) => {
                if (Number(e.target.value) <= 5.0) {
                  if (e.target.value === '') {
                    setMinterAuthority('')
                  } else if (e.target.value.match(/^[0-9.\b]+$/)) {
                    setMinterAuthority(e.target.value)
                    setRealMinterAuthority(Number(e.target.value) * 100)
                  }
                }
              }
            } />
            <Styled.SettingsInput placeholder="number of transactions" value={transactionNumber} onChange={(e) => (e.target.value.match(/^[0-9\b]+$/) || e.target.value === "") && setTransactionNumber(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('changeMinterRoyalty', [realMinterAuthority, transactionNumber])}>Change</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change author royalty</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="for ex.: 0.01 ... 10.0" value={authorRoyalty} onChange={(e) => {
                if (Number(e.target.value) <= 10.0) {
                  if (e.target.value === '') {
                    setAuthorRoyalty('')
                  } else if (e.target.value.match(/^[0-9.\b]+$/)) {
                    setAuthorRoyalty(e.target.value)
                    setRealAuthorAuthority(Number(e.target.value) * 100)
                  }
                }
              }}
              />
            <Styled.SettingsButton onClick={() => call('changeAuthorRoyalty', [realAuthorAuthority])}>Change</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set author royalty distribution</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="authors" value={distributionAuthors} onChange={(e) => setDistributionAuthors(e.target.value)} />
            <Styled.SettingsInput placeholder="for ex.: 1 ... 99" value={royaltyDistribution} onChange={(e) => (e.target.value.match(/^[0-9\b]+$/) || e.target.value === "") && setRoyaltyDistribution(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setAuthorsRoyaltyDistribution', [royaltyDistribution])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set fiat rate</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="fiat rate (in WEI)" value={fiatRate} onChange={(e) => (e.target.value.match(/^[0-9\b]+$/) || e.target.value === "") && setFiatRate(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setAuthorsRoyaltyDistribution', [fiatRate])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
        </>
      }
      {
        isValidator && 
        <>
          <Styled.SettingsPageTitle>Validator</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Verify</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="token id" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('verify', [verifyToken])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
        </>
      }
      {
        isPlatform && 
        <>
          <Styled.SettingsPageTitle>Platform</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change fee address</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="address" value={feeAddress} onChange={(e) => setFeeAddress(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('changeFeeAddress', [feeAddress])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change platform address</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="address" value={platformAddress} onChange={(e) => setPlatformAddress(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('changePlatformAddress', [platformAddress])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Mint fee</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="fee" value={mintFeePercentage} onChange={(e) => {
              if (e.target.value === '') {
                setMintFeePercentage('')
              } else if (e.target.value.match(/^[0-9.\b]+$/)) {
                setMintFeePercentage(e.target.value)
              }
            }} />
            <Styled.SettingsButton onClick={() => call('setMintFeePercentage', [Number(mintFeePercentage) * 100])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Sell fee</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="fee" value={sellFeePercentage} onChange={(e) => {
              if (e.target.value === '') {
                setSellFeePercentage('')
              } else if (e.target.value.match(/^[0-9.\b]+$/)) {
                setSellFeePercentage(e.target.value)
              }
            }} />
            <Styled.SettingsButton onClick={() => call('setSellFeePercentage', [Number(sellFeePercentage) * 100])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
        </>
      }
    </Styled.SettingsMain>
  )
}