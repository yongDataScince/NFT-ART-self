import styled from "styled-components";

export const SettingsMain = styled.div`
  width: 100%;
  padding: 120px 16px;
  overflow-y: auto;
`

export const SettingsPageTitle = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-size: 32px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  width: 100%;
  padding-bottom: 4px;
  border-bottom: 1px solid #FFF;
  font-weight: 200;
  margin-bottom: 50px;
`

export const SettinsBlock = styled.div`
  width: 100%;
  border-top: 1px solid #555;
  padding-top: 10px;
  margin-bottom: 8px;
  padding-bottom: 40px;
`

export const SettinsBlockTitle = styled.p`
  padding: 0;
  margin: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
  padding-left: 4px;
  margin-bottom: 10px;
`

export const SettingsInput = styled.input`
  border: 1px solid #555;
  padding: 10px 16px;
  background: #000;
  width: 100%;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 100%;
  color: #FFFFFF;
  margin-bottom: 4px;

  &::placeholder {
    font-family: 'Helvetica Neue';
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 100%;
    color: #888789;
  }

  &:active, &:focus {
    outline: none;
  }
`

export const UploadLabel = styled.label`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

export const SettingsDropDown = styled.div`
  width: 100%;
  height: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid #555;
  margin-bottom: 14px;
`

export const SettingsDropDownItem = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 13px;
  line-height: 150%;
  font-weight: 200;
  color: #FFFFFF;
`

export const SettingsButton = styled.button`
  border: 1px solid #555;
  background: #000;
  padding: 4px 18px;
  font-family: 'Helvetica Neue';
  font-size: 18px;
  line-height: 30px;
  font-weight: 200;
  text-align: left;
  color: #FFFFFF;
  width: 100%;
`

export const SettingsUploadBlock = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 100%;
  background: #000;
  border: 1px solid #555;
  position: relative;
  margin-bottom: 8px;
`

export const SettingsUploadText = styled.p`
  width: 65%;
  position: absolute;
  left: 20px;
  top: 0px;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 150%;
  color: #FFFFFF;
  z-index: 100;
  span {
    color: #888789;
  }
`

export const UploadPlus = styled.label`
  font-size: 180px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-family: 'Helvetica Neue';
  font-style: normal;
  position: absolute;
  z-index: 101;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 100;
`

export const UploadInputBig = styled.textarea`
  border: 1px solid #555;
  padding: 10px 16px;
  background: #000;
  width: 100%;
  height: 140px;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 100%;
  color: #FFFFFF;
  margin-bottom: 4px;
  margin-top: 40px;
  resize: vertical;

  &::placeholder {
    font-family: 'Helvetica Neue';
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 100%;
    color: #888789;
  }

  &:active, &:focus {
    outline: none;
  }
`

export const SettingsUpload = styled.input`
  position: absolute;
  width: 0%;
  height: 0%;
  background: #000;
  top: 0;
  left: 0;
  border: none;
  &:active, &:focus {
    outline: none;
  }
`
