import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CopyIcon from "../../components/UI/icons/CopyIcon";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../store";
import { settingsCall, userTokens } from "../../store/reducer";
import * as Styled from './styles'

const zeroPad = (num: number, places: number = 4) => String(num).padStart(places, '0')

export const SettingsPage: React.FC = () => {
  const { collections, signerAddress, signer, userPictures, tokens, loading, haveEth } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isValidator, setIsValidator] = useState<boolean>(false)
  const [royaltyDistribution, setRoyaltyDistribution] = useState<string>('')
  const [fiatRate, setFiatRate] = useState<string>('')
  const [verifyToken, setVerifyToken] = useState<string>('')

  const [newAdmin, setNewAdmin] = useState<string>('')
  const [oldAdmin, setOldAdmin] = useState<string>('')
  const [newValidator, setNewValidator] = useState<string>('')
  const [oldValidator, setOldValidator] = useState<string>('')
  const [addressesStr, setAddressesStr] = useState<string>('')
  const [addresses, setAddresses] = useState<string[]>([])
  const [baseUri, setBaseUri] = useState<string>('')
  const [maxSupply, setMaxSupply] = useState<string>('')
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
    if(value.match(/^[0-9,\b]+$/)) {
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
    if(value.match(/^[0-9,\b]+$/)) {
      setPricesStr({
        ...idsStr,
        [name]: value
      })
      setPrices({
        ...prices,
        [name]: value.replace(' ', '').split(',').map((id) => Number(id))
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
    collections?.[0].contract.owner().then((data: string) => {
      setIsOwner(signerAddress === data)
    })
    collections?.[0].contract.isAdmin(signerAddress).then(setIsAdmin)
    collections?.[0].contract.isValidator(signerAddress).then(setIsValidator)
    dispatch(userTokens(signer as any))
  }, [collections, dispatch, signer, signerAddress])

  useEffect(() => {
    console.log("userPictures: ", userPictures);
  }, [userPictures])

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
          userPictures?.map((pic) => (
            <Styled.Picture key={pic.tokenId} onClick={() => navigate(`/collection/${pic.collectionId}/picture/${pic.tokenId}`)}>
              <Styled.PictureImage src={pic.path} />
              <Styled.PictureFooter>
                <Styled.PictureTitle>
                 <span>#{zeroPad(pic.tokenId)}</span> {pic?.name}
                </Styled.PictureTitle>
                <Styled.PictureStatus status={tokens?.[pic.tokenId - 1]?.status}>
                  {tokens?.[pic.tokenId - 1]?.status}
                </Styled.PictureStatus>
              </Styled.PictureFooter>
            </Styled.Picture>
          ))
        }
      </Styled.SettingsPictures>
      {
        isOwner && 
        <>
          <Styled.SettingsPageTitle>Owner</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Add addmin</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new admin address" value={newAdmin} onChange={(e) => setNewAdmin(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('addAdmin', [newAdmin])}>Add</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Remove addmin</Styled.SettinsBlockTitle>
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
            <Styled.SettingsInput placeholder="prices" value={pricesStr['presale']} onChange={(e) => parsePrices(e.target.value, 'presale')}  />
            <Styled.SettingsInput placeholder="ids" value={idsStr['presale']} onChange={(e) => parseIds(e.target.value, 'presale')} />
            <Styled.SettingsButton onClick={() => call('changePresaleMintPrice', [
              idsStr['presale'], pricesStr['presale']
            ])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change mint price</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="prices" value={pricesStr['sale']} onChange={(e) => parsePrices(e.target.value, 'sale')} />
            <Styled.SettingsInput placeholder="ids" value={idsStr['sale']} onChange={(e) => parseIds(e.target.value, 'sale')} />
            <Styled.SettingsButton onClick={() => call('changeMintPrice', [
              idsStr['sale'], pricesStr['sale']
            ])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set base uri</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new base uri" value={baseUri} onChange={(e) => setBaseUri(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setBaseURI', [baseUri])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set max supply</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new max supply" value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setMaxSupply', [maxSupply])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set presale max mint</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="max mint" value={preSaleMaxMint} onChange={(e) => setPreSaleMaxMint(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setPresaleMaxMint', [preSaleMaxMint])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set presale max per mint</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="max per mint" value={preSalePerMaxMint} onChange={(e) => setPreSalePerMaxMint(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setPresaleMaxPerMint', [preSalePerMaxMint])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set presale max supply</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="presale max supply" value={maxPresaleMaxSupply} onChange={(e) => setPresaleMaxSupply(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setPresaleMaxSupply', [maxPresaleMaxSupply])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Toggle presale started</Styled.SettinsBlockTitle>
            <Styled.SettingsButton onClick={() => call('togglePresaleStarted', [])}>Toggle</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Toggle public sale started</Styled.SettinsBlockTitle>
            <Styled.SettingsButton onClick={() => call('renounceOwnership', [])}>Toggle</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Renounce ownership</Styled.SettinsBlockTitle>
            <Styled.SettingsButton>Renounce</Styled.SettingsButton>
          </Styled.SettinsBlock>
        </>
      }
      {
        (isAdmin || isOwner) &&
        <>
          <Styled.SettingsPageTitle>Admin</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change minter royalty</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="royalty" value={minterAuthority} onChange={(e) => setMinterAuthority(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('changeMinterRoyalty', [minterAuthority])}>Change</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change author royalty</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="royalty" value={authorRoyalty} onChange={(e) => setAuthorRoyalty(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('changeAuthorRoyalty', [authorRoyalty])}>Change</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set author royalty distribution</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="royalty" value={royaltyDistribution} onChange={(e) => setRoyaltyDistribution(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setAuthorsRoyaltyDistribution', [royaltyDistribution])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set fiat rate</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="fiat rate" value={fiatRate} onChange={(e) => setFiatRate(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('setAuthorsRoyaltyDistribution', [fiatRate])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
        </>
      }
      {
        (isValidator || isOwner) && 
        <>
          <Styled.SettingsPageTitle>Validator</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Verify</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="token id" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} />
            <Styled.SettingsButton onClick={() => call('verify', [verifyToken])}>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
        </>
      }
    </Styled.SettingsMain>
  )
}