import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { tokenInfo, buyToken, listToken, ICollection, mintToken } from "../../store/reducer";
import Loader from '../../components/UI/loader'
import * as Styled from './styles'
import picData from '../../assets/data/pictures.json'
import CopyIcon from "../../components/UI/icons/CopyIcon";
import InstagramIcon from "../../components/UI/icons/InstagramIcon";
import Facebook from "../../components/UI/icons/Facebook";
import TweeterIcon from "../../components/UI/icons/TweeterIcon";
import WebIcon from "../../components/UI/icons/WebIcon";
import { ethers } from "ethers";
import Footer from "../../components/Footer";

interface Picture {
  tokenId?: number,
  authors?: any[],
  name?: string,
  status?: string,
  collectionAddress?: string,
  description?: any,
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

export const CardPage: React.FC = () => {
  const params = useParams();
  const { pictureid, collection } = useMemo(() => {
    return {
      pictureid: params?.pictureid || -1,
      collection: params?.collection || -1
    }
  }, [params])
  const dispatch = useAppDispatch()
  const { collections, currToken, loading, signerAddress, haveEth, signerBalance } = useAppSelector((state) => state.web3)
  const [nwidth, setNwidth] = useState<number>(0);
  const [nheight, setNheight] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<string>('')
  const [validate, setValidate] = useState<boolean>(false)
  const [picture, setPicture] = useState<Picture | undefined>()
  const [tags] = useState<string[]>(['abstract', 'digital', 'expressionist', 'psychedelic'])
  const [currCollection, setCurrCollection] = useState<ICollection>()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement | null>(null)

  const socialIcons = useMemo(() => ({
    "instagram": <InstagramIcon color="#888789" width="28" height="28" viewBox="0 0 28 28" />,
    "facebook": <TweeterIcon color="#888789" width="17" height="28" viewBox="0 0 17 28" />,
    "twitter": <Facebook color="#888789" width="34" height="28" viewBox="0 0 34 28" />,
    "site": <WebIcon color="#888789" width="44" height="44" viewBox="0 0 44 44" />
  }), [])

  const setPrice = (value: string) => {
    if(value.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/) !== null) {
      setNewPrice(value)
    }
  }

  const buy = () => {
    dispatch(buyToken({
      tokenId: Number(pictureid),
      collectionId: Number(collection)
    }))
  }

  const list = () => {
    dispatch(listToken({
      tokenId: Number(pictureid),
      newPrice,
      validate,
      collectionId: Number(collection)
    }))
  }

  const mint = () => {
    dispatch(mintToken({
      tokenId: Number(pictureid),
      collectionId: Number(collection)
    }))
  }

  const resizeImage = useCallback(() => {
    const maxWidth = (ref.current?.offsetWidth || 0) - 34
    const maxHeight = (ref.current?.clientHeight || 0)

    let image = new Image()
    image.src = require(`../../assets/images/${pictureid}.png`);

    const ratio = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    setNheight(image.naturalHeight * ratio)
    setNwidth(image.naturalWidth * ratio)
  }, [pictureid])

  useEffect(() => {
    console.log(currToken);
  }, [currToken])

  useEffect(() => {
    dispatch(tokenInfo({
      tokenId: Number(pictureid),
      collectionId: Number(collection)
    }))
  }, [pictureid, dispatch, collections?.length, collection])

  useEffect(() => {
    resizeImage()
    window.addEventListener('resize', resizeImage);
    return () => window.removeEventListener('resize', resizeImage);
  }, [nheight, nwidth, ref, currToken, dispatch, resizeImage])

  useEffect(() => {
    if (pictureid && collection) {
      setCurrCollection(collections?.find((c) => c.id === Number(collection)))
      const pic = picData.find((pic) => pic.tokenId === Number(pictureid))
      if (!pic) {
        navigate('/')
      } else {
        setPicture(pic)
      }
    }
  }, [pictureid, navigate, collection, collections])

  useEffect(() => {
    currCollection?.contract.on("ListToken", () => {
      dispatch(tokenInfo({
        tokenId: Number(pictureid),
        collectionId: Number(collection)
      }))
    })
    currCollection?.contract.on("PublicSaleMint", () => {
      dispatch(tokenInfo({
        tokenId: Number(pictureid),
        collectionId: Number(collection)
      }))
    })
    currCollection?.contract.on("BuyToken", () => {
      dispatch(tokenInfo({
        tokenId: Number(pictureid),
        collectionId: Number(collection)
      }))
    })
    return () => {
      currCollection?.contract.removeAllListeners("ListToken");
      currCollection?.contract.removeAllListeners("PublicSaleMint");
      currCollection?.contract.removeAllListeners("BuyToken");
    };
  }, [collection, currCollection, dispatch, pictureid])

  return (
    <Styled.CardPage ref={ref}>
      <Loader show={loading} />
      <Styled.CardTitle>
        <span>#{zeroPad(Number(pictureid), 4)} </span>‘{picture?.name}’
      </Styled.CardTitle>
      <Styled.CardImage src={require(`../../assets/images/${pictureid}.png`)} width={nwidth} height={nheight} />
      <Styled.Line />
      <Styled.Price>
        <span>Price: </span> { ethers.utils.formatEther(currToken?.tokenPrice || "0") }
      </Styled.Price>
      <Styled.CardButtonGroup>
        {
          currToken?.tokenOwner === signerAddress && haveEth ? (
            <Styled.CardButton onClick={() => list()} disabled={currToken?.status === 'listed'}>
              List Token
            </Styled.CardButton>
          ) : (
            <>
            {currToken?.status === 'not minted' ? (
              <Styled.CardButton disabled={!haveEth} onClick={() => mint()}>Mint Token</Styled.CardButton>
            ) : (
              <Styled.CardButton onClick={() => buy()} 
                disabled={
                  currToken?.status === 'not available' ||
                  !haveEth                           ||
                  (signerBalance || 0) <= Number(ethers.utils.formatEther(currToken?.tokenPrice || "0"))
                }>
                Buy Token
              </Styled.CardButton>
            )}
            </>
          )
        }
      </Styled.CardButtonGroup>
      <Styled.CardInfo>
        <Styled.CardInfoTitle>
          Description:
        </Styled.CardInfoTitle>
        <Styled.CardInfoText>
          {
            Object.keys(picture?.description || {}).map((key) => {
              if (key === 'text') {
                return <>{picture?.description[key]}<br /></>
              } else {
                return <>{key}: {picture?.description[key]}<br /></>
              }
            })
          }
        </Styled.CardInfoText>

        <Styled.CardInfoTitle>
          Collection: {currCollection?.name}
        </Styled.CardInfoTitle>

        <Styled.ImageGroup>
          <Styled.ImageCollection src={
            require(`../../assets/images/collection_${currCollection?.id || 1}.png`)
          }/>
        </Styled.ImageGroup>
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
      )}

      {
        currCollection?.authors.map((author) => (
          <Styled.AuthorBlock key={author.id}>
            <Styled.AuthorAnchor id={author.address} />
            <Styled.AuthorImage src={require(`../../assets/images/${author?.avatar}`)} />
            <Styled.AuthorName onClick={() => navigate(`/author/${author?.address}`)}>{author.name}</Styled.AuthorName>
            <Styled.AuthorAddress onClick={() =>  navigator.clipboard.writeText(author?.address || '')}>
              <CopyIcon viewBox='0 0 65 35' color="#999999" /> {author?.address?.slice(0, 6)}...{author?.address?.slice(37, 42)}
            </Styled.AuthorAddress>
            {
              Object.keys(author.description).map((key) => (
                <Styled.AuthorDescriptionBlock key={key}>
                  <Styled.AuthorDescriptionTitle>{key}</Styled.AuthorDescriptionTitle>
                  <Styled.AuthorDescriptionText>
                    <Styled.AuthorDescriptionPar>
                      {
                        author.description[key].reduce((accu: any, elem: any) => {
                          return accu === null ? [elem] : [...accu, <><br/><br/></> , elem]
                        }, null)}
                      <br />
                      <br />
                    </Styled.AuthorDescriptionPar>
                  </Styled.AuthorDescriptionText>
                </Styled.AuthorDescriptionBlock>
              ))
            }
            <Styled.SocialBlock>
              {
                Object.keys(author.social).map((key) => (
                  <a href={`${author.social[key]}`} key={key}>{(socialIcons as any)[key]}</a>
                ))
              }
            </Styled.SocialBlock>
          </Styled.AuthorBlock>
        ))
      }
      <Styled.TagsContainer>
        <Styled.TagsList>
          {tags.map((tag) => <Styled.Tag key={tag}>{tag}</Styled.Tag>)}
        </Styled.TagsList>
      </Styled.TagsContainer>

      <Footer />
    </Styled.CardPage>
  )
}