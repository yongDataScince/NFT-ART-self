import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CopyIcon from "../../components/UI/icons/CopyIcon";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../store";
import { settingsCall, userTokens } from "../../store/reducer";
import * as Styled from './styles'

const zeroPad = (num: number, places: number = 4) => String(num).padStart(places, '0')

export const SettingsPage: React.FC = () => {
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const { collections, signerAddress, signer, userPictures, tokens, loading, haveEth } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [newAdmin, setNewAdmin] = useState<string>('')
  const [oldAdmin, setOldAdmin] = useState<string>('')

  const [newValidator, setNewValidator] = useState<string>('')
  const [oldValidator, setOldValidator] = useState<string>('')

  const [addressesStr, setAddressesStr] = useState<string>('')
  const [addresses, setAddresses] = useState<string[]>([])

  const [baseUri, setBaseUri] = useState<string>('')
  const [maxSupply, setMaxSupply] = useState<string>('')
  const [maxPresaleMaxSupply, setPresaleMaxSupply] = useState<string>('')

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

  const [preSaleMaxMint, setPreSaleMaxMint] = useState<string>('')
  const [preSalePerMaxMint, setPreSalePerMaxMint] = useState<string>('')

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
    dispatch(userTokens(signer as any))
  }, [collections, dispatch, signer, signerAddress])


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
                 <span>#{zeroPad(pic.tokenId)}</span> {pic.name}
                </Styled.PictureTitle>
                <Styled.PictureStatus status={tokens?.[pic.tokenId]?.status}>
                  {tokens?.[pic.tokenId]?.status}
                </Styled.PictureStatus>
              </Styled.PictureFooter>
            </Styled.Picture>
          ))
        }
      </Styled.SettingsPictures>
      {
        isOwner && 
        <>
          <Styled.SettingsPageTitle>Platform</Styled.SettingsPageTitle>
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
      {/* <Styled.SettingsPageTitle>Upload new art</Styled.SettingsPageTitle>
      <Styled.SettinsBlock>
        <Styled.SettinsBlockTitle>1. Collection choose / create</Styled.SettinsBlockTitle>
        <Styled.SettingsInput placeholder="type new collection name or choose from dropdown" />
        <Styled.SettingsDropDown>
          <Styled.SettingsDropDownItem>Item 1 Item</Styled.SettingsDropDownItem>
          <Styled.SettingsDropDownItem>Item 2 Item</Styled.SettingsDropDownItem>
          <Styled.SettingsDropDownItem>Item 3 Item</Styled.SettingsDropDownItem>
          <Styled.SettingsDropDownItem>Item 4 Item</Styled.SettingsDropDownItem>
        </Styled.SettingsDropDown>
        <Styled.SettingsButton>Add</Styled.SettingsButton>
      </Styled.SettinsBlock>
      <Styled.SettinsBlock>
        <Styled.SettinsBlockTitle>2. Collection thumbnail</Styled.SettinsBlockTitle>
        <Styled.SettingsUploadBlock>
          <Styled.UploadPlus htmlFor="upload-collection">+</Styled.UploadPlus>
          <Styled.SettingsUploadText>
            Tip: drag & drop or upload from device. <span>Your image must be 75dpi  & no more than 1000px x1000px</span>
          </Styled.SettingsUploadText>
          <Styled.SettingsUpload type="file" id="upload-collection" />
        </Styled.SettingsUploadBlock>
        <Styled.SettingsButton>Upload</Styled.SettingsButton>
      </Styled.SettinsBlock>
      <Styled.SettinsBlock>
        <Styled.SettinsBlockTitle>3. Art</Styled.SettinsBlockTitle>
        <Styled.SettingsUploadBlock>
          <Styled.UploadPlus htmlFor="upload-collection">+</Styled.UploadPlus>
          <Styled.SettingsUploadText>
          This is the file that your collector will be able to download. A smaller version will be automatically created and used for display purposes. 
          <span>Your image must be 75dpi & NO LESS than 1000px x1000px. Video should be no more than 250 mb.</span>
          </Styled.SettingsUploadText>
          <Styled.SettingsUpload type="file" id="upload-collection" />
        </Styled.SettingsUploadBlock>
        <Styled.SettingsButton>Upload</Styled.SettingsButton>

        <Styled.UploadInputBig placeholder="type art description here" />
        <Styled.SettingsButton>Add</Styled.SettingsButton>
      </Styled.SettinsBlock>
      <Styled.SettinsBlock>
        <Styled.SettinsBlockTitle>4. Tags</Styled.SettinsBlockTitle>
        <Styled.SettingsInput placeholder="type new collection name or choose from dropdown" />
        <Styled.SettingsDropDown>
          <Styled.SettingsDropDownItem>Item 1 Item</Styled.SettingsDropDownItem>
          <Styled.SettingsDropDownItem>Item 2 Item</Styled.SettingsDropDownItem>
          <Styled.SettingsDropDownItem>Item 3 Item</Styled.SettingsDropDownItem>
          <Styled.SettingsDropDownItem>Item 4 Item</Styled.SettingsDropDownItem>
        </Styled.SettingsDropDown>
        
      </Styled.SettinsBlock> */}
    </Styled.SettingsMain>
  )
}