import styled from "styled-components";

export const MainBody = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 140px;
  cursor: pointer;
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
  
`

export const MainCard = styled.div`
  width: min(49.5%, 245px);
  height: 320px;
  display: flex;
  margin-bottom: 16px;
  flex-direction: column;
  border: 1px solid #FFFFFF;
  position: relative;
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
