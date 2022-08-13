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
  border-left: 1px solid #CCCCCC;
  padding-left: 12px;
`

export const MainHeaderTitle = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 100;
  font-size: 40px;
  line-height: 100%;
  color: #FFFFFF;
  margin-bottom: 12px;
  white-space: wrap;
`

export const MainHeaderSubTitile = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 40px;
  line-height: 40px;
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
  display: flex;
  flex-direction: column;
  padding: 16px 16px 140px 16px;
  box-sizing: border-box;
  overflow-y: scroll;
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
