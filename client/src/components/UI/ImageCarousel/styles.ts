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
  margin: 0 0px;
`

export const CarouselTitleWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #CCCCCC;
  margin-bottom: 24px;
`

export const CarouselTitle = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  margin: 0;
  padding: 0;
  font-weight: 200;
  font-size: 31.25px;
  line-height: 31px;
  color: #FFFFFF;
  width: auto;
  display: inline-block;
  border-bottom: 2px solid #FFFFFF;
  padding-bottom: 4px;
`

export const PageItem = styled.div<Props>`
  width: 40px;
  height: 40px;
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
  width: 30%;
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
  min-height: 564px;
  height: auto;
  border: 1px solid #FFF;
  padding-bottom: 20px;
`

export const CardImage = styled.div<{ src: string }>`
  width: 100%;
  height: calc(100% - 110px);
  background-image: url(${({ src }) => src});
  background-size: cover;
  min-height: 450px;
`

export const CarouselFooter = styled.div`
  width: 100%;
  height: 110px;
  padding: 24px;
  background: #000;
  padding: 28px;
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
  font-size: 30px;
  line-height: 23px;
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
  &:disabled {
    svg {
      transition: all 0.2;
      opacity: 0.2;
    }
  }
`

export const CarouselFooterInfo = styled.p<{ status?: 'Available' | 'Not available' }>`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
  position: relative;
  padding-left: 16px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 11px;
    height: 11px;
    background-color: ${({ status }) => status === 'Available' ? '#1FE01B' : '#E01B1B'}; 
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
