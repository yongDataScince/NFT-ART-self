import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { tokenInfo, buyToken, listToken, ICollection, mintToken, revokeToken } from "../../store/reducer";
import Loader from '../../components/UI/loader'
import * as Styled from './styles'
import CopyIcon from "../../components/UI/icons/CopyIcon";
import InstagramIcon from "../../components/UI/icons/InstagramIcon";
import Facebook from "../../components/UI/icons/Facebook";
import TweeterIcon from "../../components/UI/icons/TweeterIcon";
import WebIcon from "../../components/UI/icons/WebIcon";
import { ethers } from "ethers";
import Footer from "../../components/Footer";

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
  const [validate, setValidate] = useState<boolean>(true)
  const [pictureMean, setPictureMean] = useState('')

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
    console.log("buy");
    dispatch(buyToken({
      tokenId: Number(pictureid),
      collectionId: Number(collection)
    }))
  }

  const revoke = () => {
    console.log("revoke");
    dispatch(revokeToken({
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
    image.src = require(`../../assets/images/${pictureid}.jpg`);

    const ratio = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    setNheight(image.naturalHeight * ratio)
    setNwidth(image.naturalWidth * ratio)
  }, [pictureid])

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
      const pic = require(`../../assets/jsons_test/${pictureid}.json`)
      setPictureMean(pic.attributes[0].value)
    }
  }, [pictureid, navigate, collection, collections])

  useEffect(() => {
    if (currToken?.status === 'not minted') {
      currCollection?.contract.on("PublicSaleMint", (minter) => {
        dispatch(tokenInfo({
          tokenId: Number(pictureid),
          collectionId: Number(collection)
        }))
        if(minter === signerAddress) {
          navigate('/settings')
        }
      })
    }
    if (currToken?.status === 'available') {
      currCollection?.contract.on("BuyToken", () => {
        dispatch(tokenInfo({
          tokenId: Number(pictureid),
          collectionId: Number(collection)
        }))
        navigate('/settings')
      })
    }
    currCollection?.contract.on("ListToken", () => {
      console.log('list');
      dispatch(tokenInfo({
        tokenId: Number(pictureid),
        collectionId: Number(collection)
      }))
    })
    currCollection?.contract.on("RevokeToken", () => {
      dispatch(tokenInfo({
        tokenId: Number(pictureid),
        collectionId: Number(collection)
      }))
    })
    return () => {
      currCollection?.contract.removeAllListeners("BuyToken");
      currCollection?.contract.removeAllListeners("ListToken");
      currCollection?.contract.removeAllListeners("RevokeToken");
      currCollection?.contract.removeAllListeners("PublicSaleMint");
    };
  }, [collection, currCollection, currToken?.status, dispatch, navigate, pictureid, signerAddress])

  useEffect(() => {
    console.log('currToken: ', currToken?.tokenCurrTokenOwner);
  }, [currToken])

  const vidRef = useRef<HTMLVideoElement | null>(null)
  
  const [play, setPlay] = useState<boolean>(false);

  const playVideo = () => {
    setPlay(true)
    vidRef.current?.play()
  }

  const pauseVideo = () => {
    setPlay(false)
    vidRef.current?.pause()
  }

  return (
    <Styled.CardPage ref={ref}>
      <Loader show={loading} />
      <Styled.CardTitle>
        <span>#{zeroPad(Number(pictureid), 4)} </span>‘{currToken?.tokenData?.name}’
      </Styled.CardTitle>
      <Styled.VidGroup>
        {!play && <Styled.PlayButton onClick={() => playVideo()}><div /></Styled.PlayButton>}
        <Styled.CardVideo widthCalc={nwidth} height={nheight+12} loop ref={vidRef} onClick={() => pauseVideo()}>
          <source src={require(`../../assets/videos/${pictureid}.mp4`)} type="video/mp4" />
        </Styled.CardVideo>
      </Styled.VidGroup>
      <Styled.Line />
      {currToken?.status === 'available' && 
        <Styled.Price>
          <span>Price: </span> { ethers.utils.formatEther(currToken?.tokenPrice || "0") } MATIC
        </Styled.Price>
      }

      {
        currToken?.status !== 'not minted' && 
        <Styled.Price>
          <span>Owned by: </span> { currToken?.tokenCurrToken === signerAddress ? 'You' : `${currToken?.tokenCurrToken?.slice(0, 5)}...${currToken?.tokenCurrToken?.slice(37, 43)}` }
        </Styled.Price>
      }
      <Styled.CardButtonGroup>
        {
          currToken?.tokenCurrToken === signerAddress && haveEth && currToken?.status !== 'available' ? (
            <Styled.InputsGroup>
              <Styled.Input placeholder="token price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
              <Styled.CardButton onClick={() => list()} disabled={currToken?.status === 'listed'}>
                List Token
              </Styled.CardButton>
            </Styled.InputsGroup>
          ) : (
            <>
            {currToken?.status === 'not minted' ? (
              <Styled.CardButton disabled={!haveEth} onClick={() => mint()}>Mint Token</Styled.CardButton>
            ) : (
              <Styled.CardButton onClick={() => {
                currToken?.tokenCurrToken !== signerAddress ? buy() : revoke()
              }}
                disabled={
                  currToken?.tokenCurrToken !== signerAddress &&
                  (!haveEth                             ||
                  currToken?.status === 'not available' ||
                  ((signerBalance || 0) <= Number(ethers.utils.formatEther(currToken?.tokenPrice || "0"))))
                }>
                {
                  currToken?.tokenCurrToken !== signerAddress ? 'Buy Token' : 'Revoke Token'
                }
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
        {pictureMean}<br/>
        {
            Object.keys(currToken?.tokenData?.attributes || {}).filter((key) => key !== 'meaning').map((key) => {
              return <><span style={{ textTransform: 'capitalize' }}>{key}</span>: {currToken?.tokenData?.attributes[key]}<br /></>
            })
          }
          <span style={{ fontSize: 20 }}>This is a 5 sec sample, full art will be available to the owner</span><br />
          <div style={{ display: 'flex' }}>
            <span style={{ whiteSpace: 'nowrap' }}>Owner link access:</span>
            <Styled.CardLink href={currToken?.tokenData?.original}>
              {currToken?.tokenData?.original}
            </Styled.CardLink>
          </div>
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
            <Styled.AuthorAnchor id={author?.address} />
            <Styled.AuthorImage src={require(`../../assets/images/${author?.avatar}`)} />
            <Styled.AuthorName>{author?.name}</Styled.AuthorName>
            <Styled.AuthorAddress onClick={() =>  navigator.clipboard.writeText(author?.address || '')}>
              <CopyIcon viewBox='0 0 20 20' color="#999999" /> {author?.address?.slice(0, 6)}...{author?.address?.slice(37, 42)}
            </Styled.AuthorAddress>
            {
              Object.keys(author?.description).map((key) => (
                <Styled.AuthorDescriptionBlock key={key}>
                  <Styled.AuthorDescriptionTitle>{key}</Styled.AuthorDescriptionTitle>
                  <Styled.AuthorDescriptionText>
                    <Styled.AuthorDescriptionPar>
                      {
                        author?.description[key].reduce((accu: any, elem: any) => {
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
                Object.keys(author?.social).map((key) => (
                  <a href={`${author?.social?.[key]}`} key={key}>{(socialIcons as any)[key]}</a>
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