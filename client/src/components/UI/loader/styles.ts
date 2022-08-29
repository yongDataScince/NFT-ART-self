import styled, { css, keyframes } from "styled-components";

interface Props {
  delay?: number,
  show?: boolean
}

const hideShow = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

export const LoaderWrapper = styled.div<Props>`
  width: 100%;
  height: 100%;
  background: #000000a0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  transition: all 0.3s;
  z-index: 1000000;
  top: 0;
  left: 0;
  ${({ show }) => css`
    opacity: ${Number(show)};
    visibility: ${ show ? 'visible' : 'hidden'};
  `}
`

export const LoaderBox = styled.div`
  width: 78px;
  height: 16px;
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 16px 16px 16px;
  grid-template-rows: 16px
`

export const LoaderItem = styled.div<Props>`
  width: 100%;
  height: 100%;
  background: #fff;
  animation: ${hideShow} 0.9s infinite;
  border-radius: 50%;
  animation-delay: ${({ delay }) => (delay || 0) * 0.1}s;
`
