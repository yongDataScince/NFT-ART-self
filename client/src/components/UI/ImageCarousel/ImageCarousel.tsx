import _ from "lodash"
import picturesData from '../../../assets/data/pictures.json';
import React, { useState } from "react"
import ChevronIcon from "../icons/ChevronIcon"
import * as Styled from './styles'
import { useNavigate } from "react-router-dom";

interface Props {
  images: number[],
  title: string
}

export const ImageCarousel: React.FC<Props> = ({ images, title }) => {
  const [currentImage, setCurrentImage] = useState<number>(1)
  const [window, setWindow] = useState<number>(3);
  const navigate = useNavigate();

  const choiseImage = (id: number) => {
    setCurrentImage(id)
  }

  return (
    <Styled.CarouselMain>
      <Styled.CarouselTitleWrapper>
        <Styled.CarouselTitle>{title}</Styled.CarouselTitle>
      </Styled.CarouselTitleWrapper>
      <Styled.CarouselCard onClick={() => navigate(`/picture/${images[currentImage - 1]}`)}>
        <Styled.CardImage src={require(`../../../assets/images/${currentImage}.png`)} />
        <Styled.CarouselFooter>
          <Styled.CarouselFooterTitle>
            <Styled.NumberSpan>#000{currentImage}</Styled.NumberSpan> {(picturesData as any)[String(currentImage)]?.authors?.join('/')}
          </Styled.CarouselFooterTitle>
          <Styled.CarouselFooterInfo status={(picturesData as any)[String(currentImage)]?.status}>
            <Styled.GraySpan>{(picturesData as any)[String(currentImage)]?.status}</Styled.GraySpan> {(picturesData as any)[String(currentImage)]?.price} BNB
          </Styled.CarouselFooterInfo>
        </Styled.CarouselFooter>
      </Styled.CarouselCard>
      <Styled.CarouselFooter>
        <Styled.CarouselPagination>
          <Styled.PagButton disabled={window === 3} onClick={() => {
              setWindow(window - 2)
              setCurrentImage(currentImage - 1)
            }}>
            <ChevronIcon />
          </Styled.PagButton>
          
          <Styled.PagesContainer>
            {_.times(images.length).slice(window - 3, window).map((id) => (
              <Styled.PageItem key={id} onClick={() => choiseImage(id + 1)} choised={currentImage === id + 1}>
                {id + 1}
              </Styled.PageItem>
            ))}
          </Styled.PagesContainer>
          <Styled.PagButton disabled={images.length - window < 1} onClick={() => {
            setWindow(window + 2)
            setCurrentImage(currentImage + 1)
          }}>
            <ChevronIcon />
          </Styled.PagButton>
        </Styled.CarouselPagination>
      </Styled.CarouselFooter>
    </Styled.CarouselMain>
  )
}