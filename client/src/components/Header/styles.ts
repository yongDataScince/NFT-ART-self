import styled, { css } from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  open?: boolean
}

export const HeaderBar = styled.header`
  position: fixed;
  z-index: 100000;
  top: 0;
  left: 0;
  background-color: #000000 !important;
  padding: 20px 32px;
  position: relative !important;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  color: #FFF;
`

export const MenuSwiper = styled.div<Props>`
  width: 50vw;
  height: 100vh;
  background-color: #000000;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 150;
  transition: all 0.2s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: translateX(${({ open }) => open ? '0' : '-100%'});
  ${({ open }) => open && css`
    box-shadow: 400px 0px 0px  1800px rgba(0,0,0,0.65);
  `}
  @media (min-width: 1440px) {
    width: 20vw;
  }
`

export const MenuSwiperTitle = styled.p`
  padding: 0;
  margin: 0 0 20px 0;
  width: 100%;
  border-bottom: 1px solid #FFF;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
`

export const MenuSwiperLinks = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  list-style: none;
  margin: 0;
  padding: 0;
`

export const MenuSwiperLink = styled.li<{ active?: boolean }>`
  width: 100%;
  padding-left: 10px;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.05em;
  position: relative;
  margin-bottom: 3px;

  ${({ active }) => css`
    cursor: ${ active ? 'pointer' : 'not-allowed' };
    color: ${ active ? '#FFFFFF' : '#888888' };
  `}

  &::before {
    content: "";
    position: absolute;
    background: #888888;
    width: 5px;
    height: 2px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`

export const HeaderTitle = styled.p`
  margin: 0;
  padding: 0;
  margin-left: auto;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 28px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
`

export const Burger = styled(MenuIcon)`
  color: #FFFFFF;
`
