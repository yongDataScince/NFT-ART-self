import styled, { css } from "styled-components";

interface Props { choised?: boolean }

export const CarouselMain = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 80px;
`

export const PagesContainer = styled.div`
  width: auto;
  height: 40px;
  display: flex;
  align-items: center;
  margin: 0 0px;
`

export const CarouselTitleWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #CCCCCC;
  margin-bottom: 24px;
`

export const CollectionName = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 100;
  font-size: 24px;
  line-height: 100%;
  color: #FFFFFF;
  margin: 0;
`

export const CarouselTitle = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  margin: 0;
  padding: 0;
  font-weight: 300;
  font-size: 24px;
  line-height: 31px;
  color: #FFFFFF;
  width: auto;
  display: inline-block;
  border-bottom: 2px solid #FFFFFF;
  padding-bottom: 4px;
`

export const PageItem = styled.div<Props>`
  width: 32px;
  height: 32px;
  cursor: pointer;
  ${({ choised }) => css`
    border: 1px solid ${choised ? '#FFF' : '#888789'};
    color: ${choised ? '#FFF' : '#888789'};
  `}

  font-family: 'Helvetica Neue';
  font-size: 20px;
  line-height: 150%;
  display: flex;
  justify-content: center;
  font-weight: 300;
  align-items: center;
  transition: all 0.2s;
  ${({ choised }) => !choised && css`
    &:hover {
      color: #cccccc;
      border-color: #cccccc;
    }
  ` }
`

export const CarouselPagination = styled.div`
  margin-left: auto;
  display: flex;
  width: auto;
  align-items: center;
  justify-content: center;
  button:first-child {
    transform: rotate(-90deg) translateX(2px);
  }
  button:last-child {
    transform: rotate(90deg) translateX(2px);
  }
`

export const CarouselCard = styled.div`
  width: 100%;
  cursor: pointer;
  min-height: 424px;
  height: auto;
  border: 1px solid #FFF;
`

export const ImgGroup = styled.div`
  width: 100%;
  height: auto;
  position: relative;
`

export const PlayButton = styled.button`
  width: 50px;
  height: 50px;
  background: #FFF;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  div {
    transform: rotate(180deg);
    border-style: solid;
    border-width: 14px 22px 14px 0;
    margin-left: 4px;
    border-color: transparent #000000 transparent transparent;
  }
`

export const CardImage = styled.div<{ src: string }>`
  width: 100%;
  height: calc(100% - 110px);
  background-image: url(${({ src }) => src});
  background-size: cover;
  min-height: 350px;
`

export const CarouselFooter = styled.div`
  width: 100%;
  height: auto;
  padding: 24px;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  justify-content: flex-start;
`

export const CarouselFooterTitle = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  
  font-weight: 300;
  font-size: 25px;
  line-height: 110%;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
  max-width: 105%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-bottom: 4px;

`

export const PagButton = styled.button`
  width: auto;
  height: auto;
  background: #000;
  border: none;
  display: flex;
  align-items: center;
  padding: 0 1px 0 1px;
  &:disabled {
    svg {
      transition: all 0.2;
      opacity: 0.2;
    }
  }
`

export const CarouselFooterInfo = styled.p<{ status?: 'available' | 'not available' }>`
  font-family: 'Helvetica Neue';
  text-transform: capitalize;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
  position: relative;
  padding-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 11px;
    height: 11px;
    background-color: ${({ status }) => status === 'available' ? '#1FE01B' : '#E01B1B'}; 
    border-radius: 50%;
  }
`

export const GraySpan = styled.span`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #888789;
`

export const NumberSpan = styled.span`
  font-weight: 100;
  font-size: inherit;
  line-height: inherit;
  color: #FFFFFF;
  font-family: 'Helvetica Neue';
  font-style: normal;
`
