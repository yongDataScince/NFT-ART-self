import styled, { css } from "styled-components";

interface Props {
  opened?: boolean;
  delay?: number;
  anyOpen?: boolean
}

export const MainInfo = styled.div<Props>`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  padding: 112px 40px 120px 50px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
  justify-content: flex-start;

  ${({ anyOpen }) => css`
    overflow-y: ${anyOpen ? 'auto' : 'hidden' };
  `}

  footer {
    width: 100vw;
    margin-left: -10px;
    margin-top: 140px;
  }
`

export const InfoBlock = styled.div<Props>`
  width: 100%;
  transition: all 0.5s;
  margin-bottom: 40px;
  ${({ delay, opened }) => css`
    transition-delay: ${delay}s;
    height: ${opened ? 'auto' : '60px'};
    max-height: ${opened ? 'auto' : '60px'};
    border-color: ${opened ? '#000' : '#FFF'};
  `}
`

export const InfoTitle = styled.p<Props>`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 200;
  font-size: 32px;
  line-height: 100%;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
  margin-bottom: 8px;
  position: relative;
  border-bottom: 1px solid #CCC;

  ${({ opened }) => css`
    svg {
      transition: all 0.2s;
      position: absolute;
      left: -28px;
      top: 60%;
      transform-origin: center;
      transform: translateY(${opened ? '-80%' : '-50%'}) rotate(${opened ? '180deg' : '0'});
    }
  `}
`

export const InfoBlockDescription = styled.p<Props>`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 100;
  font-size: 25px;
  line-height: 120%;
  color: #FFFFFF;
  padding: 0;
  margin: 40px 0 60px 0;
  transition: all 0.2s;
  ${({ opened, delay }) => css`
    transition-delay: ${delay}s;
    opacity: ${Number(opened)};
    visibility: ${opened ? 'visible' : 'hidden'};
  `}
`

export const InfoDescriptionBlock = styled.div<Props>`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${({ opened }) => css`
    height: ${opened ? 'auto' : '0'};
    opacity: ${Number(opened)};
    visibility: ${opened ? 'visible' : 'hidden'};
    .info-desc {
      height: ${opened ? 'auto' : '0'};
    }
    .text-div {
      height: ${opened ? 'auto' : '0'};
    }
  `}
`

export const InfoDescriptionBlockTitle = styled.p`
  font-family: 'Helvetica Neue';
  font-size: 20px;
  color: #FFFFFF;
  font-weight: 300;
  border-bottom: 1px solid #CCCCCC;
  margin-bottom: 16px;
`

export const InfoDescriptionBlockText = styled.p.attrs({ className: 'info-desc' })`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 120%;
  letter-spacing: -0.03em;
  color: #A3A0A0;
`
