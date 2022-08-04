import styled, { css } from "styled-components";

interface Props {
  width: number,
  height: number
}

interface PropBtn {
  choised?: boolean
}

export const CardPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: auto;
  padding: 16px 5px;
`

export const CardImage = styled.img<Props>`
  width: 100%;
  height: 100%;
  ${({ width, height }) => css`
    max-width: ${width}px;
    min-width: ${width}px;

    max-height: ${height}px;
    min-height: ${height}px;
  `}
`

export const CardTitle = styled.p`
  margin: 20px 0 0;
  padding: 0;
  padding-bottom: 4px;
  font-family: 'Helvetica Neue';
  font-size: 20px;
  width: 70%;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  border-bottom: 1px solid #FFFFFF;
`

export const CardInfo = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 15%;
  margin-top: 16px;
  margin-bottom: 20px;
`

export const CardButtonGroup = styled.div`
  display: flex;
  width: 70%;
  height: auto;
  margin-top: auto;
`

export const CardInfoTitle = styled.p`
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0;
  padding-bottom: 2px;
  font-family: 'Helvetica Neue';
  font-size: 16px;
  width: 100%;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  border-bottom: 1px solid #FFFFFF;
`

export const CardInfoText = styled.p`
  margin: 10px 0 0 0;
  padding: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: -0.03em;
  color: #A3A0A0;
`

export const CardButton = styled.button`
  padding: 12px;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-family: 'Helvetica Neue';
  font-size: 16px;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  background: #000;
  border-bottom: 1px solid #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  &:focus {
    outline: none;
  }
  &:not(&:disabled) {
      &:active {
      background-color: #CCCCCC;
      color: #000;
    }
  }
  &:disabled {
    border-bottom: 1px solid #CCCCCC;
    color: #CCCCCC;
    cursor: not-allowed;
  }
  &:nth-child(2) {
    margin-left: 5px;
  }
`

export const InputsGroup = styled.div`
  width: 70%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 5px 0;
`

export const Input = styled.input`
  width: 100%;
  height: 30px;
  background: #000;
  color: #FFF;
  border: 1px solid #FFF;
  padding: 12px;
  font-family: 'Helvetica Neue';
  font-size: 16px;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: 10px;

  &:focus {
    outline: none;
  }
`

export const ChoiseBlock = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
`

export const ChoiseBlockBtn = styled.button<PropBtn>`
  width: 50%;
  height: 30px;
  padding: 12px;
  font-family: 'Helvetica Neue';
  font-size: 16px;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  background: #000;
  ${({ choised }) => css`
    color: ${choised ? '#FFF' : '#bcbcbc'};
    border: 1px solid ${choised ? '#FFF' : '#bcbcbc'};
  `}
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:last-child {
    margin-left: 10px;
  }
  &:focus {
    outline: none;
  }
  ${({ choised }) => !choised && css`
    &:hover {
      color: #CCC;
      border: 1px solid #CCC;
    }
  `}
`
