import styled, { css } from "styled-components";

interface Props {
  opened?: boolean;
  choised?: boolean;
  delay?: number;
  maxHeight?: number;
}

export const DropDownMain = styled.div<Props>`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: auto;
  transition: all 0.25s;
  transition-delay: ${({ delay }) => delay + 's'};
  max-height: ${({ opened, maxHeight }) => opened ? `${(maxHeight || 0) + 20 + 58 + 80}px` : '64px'};
  overflow: hidden;
  padding-bottom: ${({ opened }) => opened ? '40px' : '8px'};
`

export const OpenButton = styled.button<Props>`
  width: 24px;
  height: 24px;
  margin-left: auto;
  background: #000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  transform: rotate(${({ opened }) => opened ? '0' : '180deg'});
`

export const DropDownHead = styled.div`
  width: 100%;
  border: 1px solid #FFFFFF;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  font-family: 'Helvetica Neue';
  font-size: 20px;
  line-height: 32px;
  color: #FFFFFF;
`

export const DropDownContent = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 20px;
`

export const DropDownContentItem = styled.div<Props>`
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
  ${({ delay, opened }) => !opened && css`
    transition-delay: ${delay}s;
    opacity: ${Number(opened)};
  `}

  ${({ choised }) => !choised && css`
    &:hover {
      transition-delay: 0;
      color: #B0AFB1;
      border-color: #B0AFB1;
    }
  `}
`
