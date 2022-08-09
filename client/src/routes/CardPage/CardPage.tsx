import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { setLoader, tokenInfo, buyToken, listToken } from "../../store/reducer";
import Loader from '../../components/UI/loader'
import * as Styled from './styles'
import { ethers } from "ethers";
import picData from '../../assets/data/pictures.json'
import collData from '../../assets/data/collections.json'


export const CardPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch()
  const { contract, currToken, loading, signerAddress, haveEth } = useAppSelector((state) => state.web3)
  const [nwidth, setNwidth] = useState<number>(0);
  const [nheight, setNheight] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<string>('')
  const [validate, setValidate] = useState<boolean>(false)
  const [tags, _] = useState<string[]>(['abstract', 'digital', 'expressionist', 'psychedelic'])

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
    const maxWidth = (ref.current?.offsetWidth || 0) - 34
    const maxHeight = (ref.current?.clientHeight || 0)

    let image = new Image()
    
    image.src = require(`../../assets/images/${id}.png`);

    image.onloadstart = () => {
      dispatch(setLoader(true))
    }

    (image as any).onloadend = () => {
      dispatch(setLoader(false))
    }
  
    const ratio = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    setNheight(image.naturalHeight * ratio)
    setNwidth(image.naturalWidth * ratio)

  }, [dispatch, id])

  useEffect(() => {
    if (contract) {
      dispatch(tokenInfo(Number(id)))
    }
  }, [id, dispatch, contract])


  useEffect(() => {
    resizeImage()
    window.addEventListener('resize', resizeImage);
    return () => window.removeEventListener('resize', resizeImage);
  }, [nheight, nwidth, ref, currToken, dispatch, resizeImage])

  return (
    <Styled.CardPage ref={ref}>
      <Loader show={loading} />
      <Styled.TagsContainer>
        <Styled.TagsTitle>Tags</Styled.TagsTitle>
        <Styled.TagsList>
          {tags.map((tag) => <Styled.Tag key={tag}>{tag}</Styled.Tag>)}
        </Styled.TagsList>
      </Styled.TagsContainer>
      <Styled.CardImage src={require(`../../assets/images/${id}.png`)} width={nwidth} height={nheight} />
      <Styled.CardTitle><span>#000{id}</span> ‘{(picData as any)[id || 1].name}’</Styled.CardTitle>
      <Styled.Authors><span>By</span> {(picData as any)[id || 1].authors.reduce((accu: any, elem: any) => {
            return accu === null ? [elem] : [...accu, <span> & </span> , elem]
        }, null)}</Styled.Authors>

      <Styled.CardInfo>
        <Styled.CardInfoTitle>
          Description:
        </Styled.CardInfoTitle>
        <Styled.CardInfoText>
          {(picData as any)[id || 1].description}
        </Styled.CardInfoText>

        <Styled.CardInfoTitle>
          Collection:
        </Styled.CardInfoTitle>

        <Styled.ImageGroup>
          <Styled.ImageCollection src={
            require(`../../assets/images/collection_${collData.find(({ address }) => address === (picData as any)[id || 1].collectionAddress)?.id}.png`)
          }/>
          <p>{collData.find(({ address }) => address === (picData as any)[id || 1].collectionAddress)?.name}</p>
        </Styled.ImageGroup>
        <Styled.Price>
          <span>Price: </span>{(picData as any)[id || 1].price} BNB
        </Styled.Price>
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