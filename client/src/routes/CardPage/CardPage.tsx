import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { setLoader, tokenInfo, buyToken, listToken } from "../../store/reducer";
import Loader from '../../components/UI/loader'
import * as Styled from './styles'
import { ethers } from "ethers";

export const CardPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch()
  const { contract, currToken, loading, signerAddress, haveEth } = useAppSelector((state) => state.web3)
  const [nwidth, setNwidth] = useState<number>(0);
  const [nheight, setNheight] = useState<number>(0);
  const [currImgSrc, setCurrImgSrc] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('')
  const [validate, setValidate] = useState<boolean>(false)

  const ref = useRef<HTMLDivElement | null>(null)

  const setPrice = (value: string) => {
    
    if(value.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/) !== null) {
      setNewPrice(value)
    }
  }

  const buy = () => {
    dispatch(buyToken(Number(id))) // buyToken(uint256)
    dispatch(tokenInfo(Number(id)))
  }

  const list = () => {
    dispatch(listToken({
      tokenId: Number(id),
      newPrice,
      validate
    }))
    dispatch(tokenInfo(Number(id)))
  }

  const resizeImage = useCallback(() => {
    const maxWidth = (ref.current?.offsetWidth || 0) - ((ref.current?.offsetWidth || 0) * 0.3)
    const maxHeight = (ref.current?.offsetHeight || 0) - 10

    let image = new Image()
    image.src = currImgSrc;
    
    image.onloadstart = () => {
      dispatch(setLoader(true))
    }

    (image as any).onloadend = () => {
      dispatch(setLoader(false))
    }
    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      setCurrImgSrc(require('./placeholder.png'))
    } else {
      const ratio = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);

      setNheight(image.naturalHeight * ratio)
      setNwidth(image.naturalWidth * ratio)
    }
  }, [currImgSrc, dispatch, ref])

  useEffect(() => {

    if (contract) {
      dispatch(tokenInfo(Number(id)))
    }
  }, [id, dispatch, contract])

  useEffect(() => {
    if (currToken?.image !== 'placeholder' && currToken?.image) {
      setCurrImgSrc(currToken.image)
    } else {
      setCurrImgSrc(require('./placeholder.png'))
    }
  }, [currToken])

  useEffect(() => {
    if(ref && currToken?.image) {
      resizeImage()
    }
    window.addEventListener('resize', resizeImage);
    return () => window.removeEventListener('resize', resizeImage);
  }, [nheight, nwidth, ref, currToken, dispatch, resizeImage, currImgSrc])

  return (
    <Styled.CardPage ref={ref}>
      <Loader show={loading} />
      <Styled.CardImage src={currImgSrc} width={nwidth} height={nheight} />
      <Styled.CardTitle>{currToken?.name}</Styled.CardTitle>
      <Styled.CardInfo>
        <Styled.CardInfoTitle>Owner: {currToken?.owner}</Styled.CardInfoTitle>
        <Styled.CardInfoTitle>Price: {ethers.utils.formatEther(currToken?.price || '0')} BNB</Styled.CardInfoTitle>
        <Styled.CardInfoTitle>
          Description:
        </Styled.CardInfoTitle>
        <Styled.CardInfoText>
          {currToken?.description}
        </Styled.CardInfoText>
      </Styled.CardInfo>

      {(currToken?.owner === signerAddress && haveEth) && (
        <Styled.InputsGroup>
          <Styled.CardInfoTitle>List token parameters:</Styled.CardInfoTitle>
          <Styled.Input placeholder="price" value={newPrice} onChange={(e) => setPrice(e.target.value)} />
          <Styled.ChoiseBlock>
            <Styled.ChoiseBlockBtn onClick={() => setValidate(true)} choised={validate}>validate</Styled.ChoiseBlockBtn>
            <Styled.ChoiseBlockBtn onClick={() => setValidate(false)} choised={!validate}>not validate</Styled.ChoiseBlockBtn>
          </Styled.ChoiseBlock>
        </Styled.InputsGroup>
      )
      }

      <Styled.CardButtonGroup>
        {
          currToken?.owner === signerAddress && haveEth ? (
            <Styled.CardButton onClick={() => list()} disabled={currToken?.status === 'listed'}>
              List Token
            </Styled.CardButton>
          ) : (
            <Styled.CardButton onClick={() => buy()} disabled={currToken?.status === 'not listed' || !haveEth}>
              Buy Token
            </Styled.CardButton>
          )
        }
      </Styled.CardButtonGroup>
    </Styled.CardPage>
  )
}