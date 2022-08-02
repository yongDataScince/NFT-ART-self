import styled, { css } from "styled-components";

interface Props {
  choised?: boolean;
  opened?: boolean;
}

export const SizeBox = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 0.5px #CCCCCC solid;
  padding-bottom: 32px;
  margin-bottom: 16px;
`

export const SizeTitle = styled.p<Props>`
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

export const SizeList = styled.div`
  display: flex;
  height: 56px;
  width: 100%;
  justify-content: flex-start;
`

export const SizeCard = styled.div<Props>`
  height: 100%;
  width: 83px;
  cursor: pointer;
  margin-right: 12px;
  text-align: center;
  background: #000;
  border: 1px solid ${({ choised }) => choised ? '#FFFFFF' : '#888789'};
  color: ${({ choised }) => choised ? '#FFFFFF' : '#888789'};
  font-family: 'Helvetica Neue';
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  padding: 12px;
  transition: all 0.2s;
  ${({ choised }) => !choised && css`
    &:hover {
      color: #B0AFB1;
      border-color: #B0AFB1;
    }
  `}
`
