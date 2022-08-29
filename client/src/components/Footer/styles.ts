import styled from "styled-components";
import { Link } from "react-router-dom";

export const FooterMain = styled.footer`
  width: 120%;
  height: 500px;
  padding: 24px 12px 30px 40px;
  background: linear-gradient(180deg, #000000 4.65%, rgba(110, 110, 110, 0.2)  78.84%);
  display: flex;
  flex-direction: column;
  border-top: 1px solid #FFFFFF;
  margin-bottom: -140px;
`

export const FooterTitle = styled.p`
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: right;
  font-family: 'Helvetica Neue';
  font-style: normal;
  padding-right: calc(5% + 12px);
  bottom: 0;
  left: 0;
  font-weight: 300;
  font-size: 25.25px;
  line-height: 25px;
  color: #FFFFFF;
  margin-bottom: 30px;
`

export const CopyRight = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #B0AFB1;
  text-decoration: none;
  margin-top: 20px;
`

export const FooterNav = styled.ul`
  display: flex;
  padding: 0; 
  margin: 0;
  flex-direction: column;
  height: auto;
`

export const InternalLink = styled(Link)`
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #B0AFB1;
  text-decoration: none;
  margin-bottom: 10px;
`

export const Icons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  svg {
    transform: scale(0.75);
    margin-right: 10px;
  }
`

export const ExternalLink = styled.a`
  text-decoration: none;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #B0AFB1;
  margin-bottom: 10px;

`
