import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store";
import * as Styled from './styles'

export const SettingsPage: React.FC = () => {
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const { collections, signerAddress } = useAppSelector((state) => state.web3)

  useEffect(() => {
    collections?.[0].contract.owner().then((data: string) => {
      setIsOwner(signerAddress === data)
    })
  }, [collections, signerAddress])

  return (
    <Styled.SettingsMain>
      {
        isOwner && 
        <>
          <Styled.SettingsPageTitle>Platform</Styled.SettingsPageTitle>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Add addmin</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new admin address" />
            <Styled.SettingsButton>Add</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Remove addmin</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="remove admin address" />
            <Styled.SettingsButton>Remove</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Add to presale</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="addresses" />
            <Styled.SettingsButton>Add</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Add validator</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new validator address" />
            <Styled.SettingsButton>Add</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Remove validator</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="validator address" />
            <Styled.SettingsButton>Remove</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change author royalty</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="royalty" />
            <Styled.SettingsButton>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change minter royalty</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="number of transactions" />
            <Styled.SettingsInput placeholder="royalty" />
            <Styled.SettingsButton>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change fee address</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new fee address" />
            <Styled.SettingsButton>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change platform address</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="new address" />
            <Styled.SettingsButton>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change mint price</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="prices" />
            <Styled.SettingsInput placeholder="ids" />
            <Styled.SettingsButton>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Change presale mint price</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="prices" />
            <Styled.SettingsInput placeholder="ids" />
            <Styled.SettingsButton>Set</Styled.SettingsButton>
          </Styled.SettinsBlock>
          <Styled.SettinsBlock>
            <Styled.SettinsBlockTitle>Set authors royalty distribution</Styled.SettinsBlockTitle>
            <Styled.SettingsInput placeholder="addresses" />
            <Styled.SettingsInput placeholder="rates" />
            <Styled.SettingsButton>Set</Styled.SettingsButton>
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