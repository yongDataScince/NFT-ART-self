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
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  transition: all 0.3s;
  z-index: 1000;
  ${({ show }) => css`
    opacity: ${Number(show)};
    visibility: ${ show ? 'visible' : 'hidden'};
  `}
`

export const LoaderBox = styled.div`
  width: 38px;
  height: 38px;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: 10px 10px 10px;
  grid-template-rows: 10px 10px 10px;
`

export const LoaderItem = styled.div<Props>`
  width: 100%;
  height: 100%;
  background: #fff;
  animation: ${hideShow} 0.9s infinite;
  animation-delay: ${({ delay }) => (delay || 0) * 0.1}s;
`
