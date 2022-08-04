import styled from "styled-components";

interface Props {
  opened?: boolean
}

export const PriceBox = styled.div<Props>`
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  max-height: ${({ opened }) => opened ? '257px' : '25px'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 0.5px ${({ opened }) => opened ? '#CCCCCC' : '#000000'} solid;
  padding-bottom: 32px;
  margin-bottom: 16px;
`

export const PriceTitle = styled.p<Props>`
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
  margin: 0;
  padding: 0 0 0 24px;
  position: relative;
  margin-bottom: 54px;

  &::before {
    position: absolute;
    content: "${({ opened }) => opened ? '-' : '+'}";
    left: 2px;
    top: 50%;
    transition: all 0.2s;
    transform-origin: center;
    transform: translateY(${({ opened }) => !opened ? '-40%' : '-50%'}) rotate(${({ opened }) => !opened ? '-90deg' : '0'});
    color: #888789;
  }
`

export const PriceFork = styled.div`
  width: 100%;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`

export const ForkLine = styled.div`
  width: 12px;
  height: 1px;
  background: #FFF;
  transform: translateY(50%);
`

export const PriceBoxInput = styled.input`
  width: calc(50% - 50px);
  height: 100%;
  background: #000;
  border: 0.5px solid #CCCCCC;
  padding: 25px 0;
  text-transform: uppercase;
  color: #FFFFFF;
  font-family: 'Helvetica Neue';
  font-size: 16px;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  &:focus {
    outline: none;
  }
`

export const NameBlock = styled.p`
  margin: 0;
  padding: 0;
  width: 100%;
  margin-top: 16px;
  font-family: 'Helvetica Neue';
  font-size: 14px;
  line-height: 32px;
  text-align: center;
  color: #FFFFFF;
`

export const NameSpan = styled.span`
  margin: 0;
  padding: 0;
  color: #888789;
  font-family: 'Helvetica Neue';
  font-size: 14px;
  line-height: 32px;
  text-align: center;
`
