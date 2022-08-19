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
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  padding: 120px 16px;
  scroll-behavior: smooth;
`

export const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding-top: 14px;
  align-items: flex-start;
  margin-top: 12px;
  border-top: 2px solid #CCC;
`

export const TagsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: calc(100% - 30px);
`

export const Tag = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-size: 25px;
  font-weight: 200;
  line-height: 21px;
  position: relative;
  letter-spacing: -0.02em;
  color: #FFF; //#58575B
  padding-left: 5px;
  text-transform: lowercase;
  &::before {
    content: "#";
    color: #58575B;
  }
`

export const TagsTitle = styled.p`
  margin: 0;
  width: 100%;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 200;
  font-size: 30px;
  line-height: 120%;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  padding-bottom: 3px;
  margin-bottom: 6px;
  border-bottom: 1px solid #CCCCCC;
`

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #CCC;
  display: block;
  border-bottom: 1px solid #CCC;
`

export const CardImage = styled.img<Props>`
  width: 100%;
  height: 100%;
  border: 1px solid #FFFFFF;
  position: relative;
  margin-bottom: 8px;

  ${({ width, height }) => css`
    max-width: ${width}px;
    min-width: ${width}px;

    max-height: ${height}px;
    min-height: ${height}px;
  `}
`

export const CardTitle = styled.p`
  padding: 0;
  margin: 0;
  padding-bottom: 4px;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 200;
  font-size: 25px;
  line-height: 100%;
  width: 100%;
  color: #FFFFFF;
  border-bottom: 1px solid #FFFFFF;
  width: 100%;
  margin-top: 16px;
  font-weight: 400;
  margin-bottom: 10px;
  span {
    font-weight: 100;
  }
`

export const Authors = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 100;
  font-size: 20px;
  line-height: 100%;
  width: 100%;
  margin: 0;
  margin-top: 8px;
  border-bottom: 1px solid #FFFFFF;
  font-weight: 320;
  color: #FFFFFF;
  padding-bottom: 12px;
  margin-bottom: 8px;
  span {
    font-weight: 100;
  }
  a {
    font-family: 'Helvetica Neue';
    font-style: normal;
    font-weight: 100;
    font-size: 20px;
    line-height: 100%;
    font-weight: 320;
    color: #FFFFFF;
    text-decoration: none;
  }
`

export const CardInfo = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-top: 32px;
`

export const CardButtonGroup = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  margin-top: 10px;
`

export const CardInfoTitle = styled.p`
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0;
  padding-bottom: 2px;
  font-family: 'Helvetica Neue';
  font-size: 20px;
  width: 100%;
  font-weight: 200;
  line-height: 150%;
  color: #FFFFFF;
  border-bottom: 1px solid #CCCCCC;
`

export const CardInfoText = styled.p`
  margin: 0;
  padding: 0;
  width: 90%;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 120%;
  letter-spacing: -0.03em;
  color: #A3A0A0;
  margin-bottom: 20px;
  text-align: left;
  margin-top: 6px;
`

export const CardButton = styled.button`
  padding: 16px 12px;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 40px;
  width: 100%;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 100%;
  color: #FFFFFF;
  background: #000;
  border-bottom: 1px solid #FFFFFF;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  position: relative;
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
    opacity: 0.4;
    cursor: not-allowed;
    &::before {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #E01B1B;
      border-radius: 50%;
      content: "";
      left: 16px;
    }
  }
  &:nth-child(2) {
    margin-left: 5px;
  }
  &::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #1FE01B;
    border-radius: 50%;
    content: "";
    left: 16px;
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

export const ImageCollection = styled.img`
  width: 184px;
  height: 184px;
  border: 1px solid #FFF;
`

export const ImageGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 20px;
  margin-top: 10px;
  p {
    font-family: 'Helvetica Neue';
    font-size: 25px;
    line-height: 150%;
    margin: 0;
    padding: 0;
    font-weight: 200;
    color: #FFFFFF;
  }
`

export const Price = styled.p`
  font-family: 'Helvetica Neue';
  text-align: left;
  font-size: 20px;
  width: 100%;
  line-height: 100%;
  letter-spacing: -0.02em;
  font-weight: 200;
  color: #FFFFFF;
  margin: 11px 0;
  padding: 0;
  span {
    color: #888789;
    margin: 0;
    padding: 0;
  }
`

export const AuthorBlock = styled.div`
  width: 100%;
  margin-top: 20px;
  border-top: 1px solid #FFF;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`

export const AuthorAnchor = styled.div`
  position: absolute;
  left: 0;
  top: 1.5%;
  width: 0;
  height: 0;
`

export const AuthorImage = styled.img`
  width: 184px;
  height: 184px;
  border: 1px solid #FFF;
  margin-bottom: 16px;
`

export const AuthorName = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 30px;
  line-height: 100%;
  color: #FFFFFF;
  padding: 0;
  margin: 0;
  width: 100%;
  padding-bottom: 8px;
  border-bottom: 1px solid #FFF;
`

export const AuthorAddress = styled.p`
  width: 100%;
  font-family: 'Helvetica Neue';
  font-size: 20px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin: 0;
  font-weight: 300;
  padding: 0;
  margin-top: 16px;
  margin-bottom: 8px;
  transition: all 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  &:active {
    color: #666666;
  }
`

export const AuthorDescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  width: 100%;
`

export const AuthorDescriptionTitle = styled.p`
  font-family: 'Helvetica Neue';
  text-transform: capitalize;
  font-size: 20px;
  line-height: 150%;
  font-weight: 200;
  width: 100%;
  border-bottom: 1px solid #CCCCCC;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
`

export const AuthorDescriptionText = styled.div`
  display: flex;
  flex-direction: column;
`

export const AuthorDescriptionPar = styled.p`
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 120%;
  letter-spacing: -0.03em;
  color: #A3A0A0;
  font-weight: 300;
`

export const SocialBlock = styled.div`
  display: flex;
  margin-top: 24px;
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid #CCC;
  svg {
    margin-right: 8px;
  }
`
