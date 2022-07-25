import styled from 'styled-components';
import { AppBar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export const HeaderBar = styled(AppBar)`
  background-color: #000000 !important;
  padding: 20px 32px;
  border-bottom: 0.5px #CCCCCC solid;
  display: flex;
  flex-direction: row !important;
  justify-content: flex-start;
`

export const HeaderButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  border: none;
  background-color: #000000 !important;
  &:first-child {
    margin-right: 24px;
  }
`

export const HeaderTitle = styled.p`
  margin: 0;
  padding: 0;
  margin-left: auto;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 31.25px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
`

export const Burger = styled(MenuIcon)`
  color: #FFFFFF;
`
