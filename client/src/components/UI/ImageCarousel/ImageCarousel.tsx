import _ from "lodash"
import React, { useEffect, useState } from "react"
import ChevronIcon from "../icons/ChevronIcon"
import * as Styled from './styles'
import { useNavigate } from "react-router-dom";
import { ICollection } from "../../../store/reducer";
import { useAppSelector } from "../../../store";
import picData from '../../../assets/data/pictures.json'

interface Props {
  images: number[],
  collectionId: number,
  collectionName: string,
  title: string
}
const zeroPad = (num: number, places: number = 4) => String(num).padStart(places, '0')
export const ImageCarousel: React.FC<Props> = ({ images, collectionId, title, collectionName }) => {
  const [currentImage, setCurrentImage] = useState<number>(1)
  const [window, setWindow] = useState<number>(3);
  const { collections } = useAppSelector((s) => s.web3)
  const [currCollection, setCurrCollection] = useState<ICollection>()
  const navigate = useNavigate();

  const choiseImage = (id: number) => {
    setCurrentImage(id)
  }

  useEffect(() => {
    const c = collections?.find((c) => c.id === collectionId)
    setCurrCollection(c)
  }, [collectionId, collections])

  return (
    <Styled.CarouselMain>
      <Styled.CarouselTitleWrapper>
        <Styled.CollectionName>{currCollection?.authors.map((a) => a.name)?.join(' / ')}</Styled.CollectionName>
        <Styled.CarouselTitle>{title}</Styled.CarouselTitle>
      </Styled.CarouselTitleWrapper>
      <Styled.CarouselCard onClick={() => navigate(`collection/${collectionId}/picture/${images[currentImage - 1]}`)}>
        <Styled.CardImage src={require(`../../../assets/images/${currentImage}.png`)} />
        <Styled.CarouselFooter>
          <Styled.CarouselFooterTitle>
            <Styled.NumberSpan>#{zeroPad(currentImage)}</Styled.NumberSpan> { (picData as any)[String(currentImage)]?.name }
          </Styled.CarouselFooterTitle>
          <Styled.CarouselFooterInfo status={(picData as any)[String(currentImage)]?.status}>
            <Styled.GraySpan>{(picData as any)[String(currentImage)]?.status || "Not available"}</Styled.GraySpan>
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