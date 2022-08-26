import _ from "lodash"
import React, { useEffect, useState } from "react"
import ChevronIcon from "../icons/ChevronIcon"
import * as Styled from './styles'
import { useNavigate } from "react-router-dom";
import { ICollection, tokenInfos } from "../../../store/reducer";
import { useAppDispatch, useAppSelector } from "../../../store";
import { BigNumber, ethers } from "ethers";

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
  const { collections, tokens, signerAddress } = useAppSelector((s) => s.web3)
  const [currCollection, setCurrCollection] = useState<ICollection>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const choiseImage = (id: number) => {
    setCurrentImage(id)
  }

  const formatPrice = (price?: BigNumber) => {
    const strPrice = ethers.utils.formatEther(price || "0");
    return strPrice.length > 10 ? Number(strPrice).toExponential() : strPrice
  }

  useEffect(() => {
    const c = collections?.find((c) => c.id === collectionId)
    setCurrCollection(c)
    dispatch(tokenInfos({ collectionId }))
  }, [collectionId, collections, dispatch])

  return (
    <Styled.CarouselMain>
      <Styled.CarouselTitleWrapper>
        <Styled.CollectionName>{currCollection?.authors.map((a) => a?.name)?.join(' / ')}</Styled.CollectionName>
        <Styled.CarouselTitle>Collection: {title}</Styled.CarouselTitle>
      </Styled.CarouselTitleWrapper>
      <Styled.CarouselCard onClick={() => navigate(`collection/${collectionId}/picture/${images[currentImage - 1]}`)}>
        <Styled.CardImage src={require(`../../../assets/images/${currentImage - 1}.jpg`)} />
        <Styled.CarouselFooter>
          <Styled.CarouselFooterTitle>
            <Styled.NumberSpan>#{zeroPad(currentImage - 1)}</Styled.NumberSpan> { tokens?.[currentImage - 1]?.name }
          </Styled.CarouselFooterTitle>
          <Styled.CarouselFooterInfo status={tokens?.[currentImage - 1]?.status}>
            <Styled.GraySpan>{
            tokens?.[currentImage - 1]?.tokenCurrTokenOwner === signerAddress ? 
           (tokens?.[currentImage - 1]?.status === 'available' ? 'listed' : 'not listed') : tokens?.[currentImage - 1]?.status}</Styled.GraySpan> {tokens?.[currentImage - 1]?.status === 'available' && `${formatPrice(tokens?.[currentImage - 1]?.tokenPrice)} MATIC`}
          </Styled.CarouselFooterInfo>
        </Styled.CarouselFooter>
      </Styled.CarouselCard>
      <Styled.CarouselFooter>
        <Styled.CarouselPagination>
          <Styled.PagButton disabled={window === 3} onClick={() => {
              setWindow(window - 2)
              setCurrentImage(currentImage - 2)
            }}>
            <ChevronIcon />
          </Styled.PagButton>

          <Styled.PagesContainer>
            {_.times((tokens?.length || 0)).slice(window - 3, window).map((id) => (
              <Styled.PageItem key={id} onClick={() => choiseImage(id + 1)} choised={currentImage === id + 1}>
                {id + 1}
              </Styled.PageItem>
            ))}
          </Styled.PagesContainer>
          <Styled.PagButton disabled={images.length - window < 2} onClick={() => {
            setWindow(window + 2)
            setCurrentImage(currentImage + 2)
          }}>
            <ChevronIcon />
          </Styled.PagButton>
        </Styled.CarouselPagination>
      </Styled.CarouselFooter>
    </Styled.CarouselMain>
  )
}