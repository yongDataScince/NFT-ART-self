import styled, { css } from "styled-components";

interface Props {
  choised?: boolean;
}


export const ChoiserBox = styled.div`
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

export const ChoiserTitle = styled.p`
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
  margin: 0;
  padding: 0 0 0 16px;
  position: relative;
  margin-bottom: 54px;

  &::before {
    position: absolute;
    content: "-";
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #888789;
  }
`

export const TypesList = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
`

export const TypeCard = styled.div<Props>`
  border: 1px solid ${({ choised }) => choised ? '#FFFFFF' : '#888789'};
  padding: 4px 24px;
  font-family: 'Helvetica Neue';
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  color: ${({ choised }) => choised ? '#FFFFFF' : '#888789'};
  transition: all 0.2s;
  cursor: pointer;
  margin: 0 8px 8px 0;

  ${({ choised }) => !choised && css`
    &:hover {
      transition-delay: 0;
      color: #B0AFB1;
      border-color: #B0AFB1;
    }
  `}
`