import styled, { css } from "styled-components";

interface Props {
  opened?: boolean;
}

export const AuthorMain = styled.div`
  width: 100%;
  height: auto;
  overflow-y: auto;
`

export const AuthorHeaderImage = styled.img `
  width: 100%;
  max-height: 320px;
`

export const AuthorHeader = styled.header`
  width: 100%;
  height: auto;
  padding: 53px 10px 20px 10px;
  position: relative;
  display: flex;
  flex-direction: column;

  &::after {
    position: absolute;
    bottom: 0;
    left: 10px;
    width: 54%;
    height: 1px;
    content: "";
    background: #CCC;
  }
`

export const AuthorHeaderImg = styled.img`
  width: 150px;
  height: 150px;
  position: absolute;
  left: 20px;
  top: -100px;
  border: 2px solid #FFF;
`

export const AuthorHeaderTitle = styled.p`
  font-family: 'Helvetica Neue';
  font-weight: 300;
  font-size: 60px;
  line-height: 100%;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
`

export const CopyBlock = styled.p`
  width: 100%;
  padding: 0;
  margin: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 700;
  font-size: 27px;
  line-height: 150%;
  margin-top: 4px;
  color: #FFFFFF;
  font-weight: 400;
  &:active {
    color: #666666;
  }
  svg {
    margin-right: 10px;
  }
`

export const AuthorBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  position: relative;
  padding: 10px;

  &::after { 
    content: "";
    position: absolute;
    bottom: 0;
    left: 10px;
    width: 50%;
    height: 2px;
    background: #fff;
  }
`

export const InfoBlock = styled.div<Props>`
  width: 100%;
  transition: all 0.5s;
  height: auto;
  margin-bottom: 10px;
  ${({ opened }) => css`
    max-height: ${opened ? 'auto' : '24px'};
    border-color: ${opened ? '#000' : '#FFF'};
    border-bottom: ${opened ? '1px solid #CCCCCC' : 'none' };
  `}
  &:last-child {
    border-bottom: none;
  }
`

export const InfoBlockTitle = styled.p`
  width: 100%;
  margin: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: -0.05em;
  text-transform: lowercase;
  color: #FFFFFF;
`

export const InfoBlockText = styled.p<Props>`
  width: 100%;
  height: auto;
  margin: 0;
  width: 100%;
  padding: 0 12px;
  font-family: 'Helvetica';
  height: 100%;
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: -0.05em;
  text-transform: lowercase;
  color: #FFFFFF;
  transition: all 0.1s;
  ${({ opened }) => css`
    opacity: ${Number(opened)};
    visibility: ${opened ? 'visible' : 'hidden'};
    max-height: ${opened ? 'auto' : '0'};
  `}
`

export const SocialBlock = styled.div`
  display: flex;
  margin-top: 20px;
  width: 100%;
  padding-top: 16px;
  padding: 0 10px;
  svg {
    margin-right: 8px;
  }
`

export const AuthorFooter = styled.div`
  width: 100%;
  height: 260px;
  /* position: relative; */
  /* bottom: -20%; */
  /* left: 0; */
  /* margin-top: auto; */
  background: linear-gradient(180deg, #000000 4.65%, rgba(110, 110, 110, 0.2)  78.84%);;
  display: flex;
`
