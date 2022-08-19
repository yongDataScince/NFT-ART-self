import React from "react";
import * as Styled from './styles'

export const SettingsPage: React.FC = () => {
  return (
    <Styled.SettingsMain>
      <Styled.SettingsPageTitle>Platform</Styled.SettingsPageTitle>
      <Styled.SettinsBlock>
        Set mint fee percentage
      </Styled.SettinsBlock>
      <Styled.SettingsPageTitle>Upload new art</Styled.SettingsPageTitle>
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
        
      </Styled.SettinsBlock>
    </Styled.SettingsMain>
  )
}