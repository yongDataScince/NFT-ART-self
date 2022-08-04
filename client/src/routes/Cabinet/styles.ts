import styled from "styled-components";

export const CabinetHeader = styled.header`
  width: 100%;
  height: 50px;
  background: #000;
  padding: 12px 0;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #FFFFFF;
`

export const BackBtn = styled.button`
  width: auto;
  height: 100%;
  cursor: pointer;
  border: none;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
  background: #000;
  display: flex;
  align-items: center;
  padding: 2px 10px;
  svg {
    margin-right: 10px;
    padding-bottom: 2px;
  }
`

export const CabinetMain = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 12px 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

export const AddressField = styled.p`
  margin: 20px;
  padding: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
  width: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    color: #999999;
    svg {
      color: #ff0000;
    }
  }
`
