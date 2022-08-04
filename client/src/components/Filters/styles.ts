import styled from 'styled-components';

interface Props {
  opened?: boolean;
}

export const FiltersBox = styled.div<Props>`
  height: 100%;
  top: 72px;
  width: 100%;
  max-height: ${({ opened }) => opened ? '100%' : '72px'};
  background-color: #000000;
  overflow: hidden;
  transition: all .3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: ${({ opened }) => opened ? 'auto' : 'hodden'};;
  &::-webkit-scrollbar {
    width: 2px;
    background: #000000;
  }
  &::-webkit-scrollbar-thumb {
    width: 2px;
    background-color: #FFF;
    border-radius: 4px;
  }
`

export const FilterHeader = styled.div`
  height: 72px;
  padding: 20px 32px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 0.5px #CCCCCC solid;
  justify-content: flex-start;
`

export const FilterSection = styled.div`
  width: 100%;
  height: auto;
  border-bottom: 0.5px #CCCCCC solid;
  padding-top: 16px;
  padding-bottom: 32px;
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

export const FiltersTitle = styled.p`
  padding: 0;
  margin: 0;
  margin-left: 40px;
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  letter-spacing: -0.02em;
  text-transform: lowercase;
  color: #FFFFFF;
`

export const FilterBody = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  padding: 40px 30px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`
