import styled from "styled-components";

export const MainHeader = styled.div`
  width: 100%;
  height: auto;
  padding: 160px 53px 160px 32px;
  box-sizing: border-box;
`

export const MainHeaderWrapper = styled.div`
  width: 100%;
  height: 100%;

`

export const MainHeaderTitle = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 100;
  font-size: 36px;
  line-height: 100%;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  white-space: wrap;
  margin-bottom: 6px;
  position: relative;
  margin-left: 10px;

  &::before {
    position: absolute;
    content: "";
    height: 95%;
    width: 1px;
    background: #CCC;
    top: 50%;
    left: -8px;
    transform: translateY(-50%);
  }
`

export const MainHeaderSubTitile = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 40px;
  line-height: 40px;
  margin-top: 32px;
  color: #FFFFFF;
`

export const Code = styled.p`
  color: #FFF;
  width: 100%;
  white-space: nowrap;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 20px;
`

export const MainBody = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  padding: 16px 16px 140px 16px;
  footer {
    margin-top: 50px;
  }
`

export const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  padding-top: 250px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px;
  overflow-y: auto;
  @media (min-width: 1440px) {
    justify-content: center;
  }
`

export const MainCard = styled.div`
  width: min(49.5%, 245px);
  height: 320px;
  display: flex;
  margin-bottom: 16px;
  flex-direction: column;
  border: 1px solid #FFFFFF;
  position: relative;
  @media (min-width: 1440px)  {
    margin-right: 16px;
  }
`

export const MainCardImg = styled.img`
  width: 100%;
  height: 100%;
`

export const MainCardFooter = styled.div`
  width: 100%;
  height: 73px;
  background: #000;
  padding: 12px;
`

export const MainCardFooterTitle = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-weight: 100;
  font-size: 20px;
  line-height: 150%;
  color: #FFFFFF;
`

export const CardInfo = styled.p`
  margin: 0;
  padding: 0;
  padding-left: 10px;
  position: relative;
  font-family: 'Helvetica Neue';
  font-size: 12px;
  line-height: 18px;
  font-weight: 100;
  color: #FFFFFF;
  display: flex;
  &::before {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    background: #1FE01B;
  }
`

export const CardPrice = styled.span`
  padding: 0;
  margin: 0;
  padding-left: 5px;
  color: #F0CF1E;
`
