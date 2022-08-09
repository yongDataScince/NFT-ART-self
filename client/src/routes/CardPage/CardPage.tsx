import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { setLoader, tokenInfo, buyToken, listToken } from "../../store/reducer";
import Loader from '../../components/UI/loader'
import * as Styled from './styles'
import picData from '../../assets/data/pictures.json'
import collData from '../../assets/data/collections.json'
import authData from '../../assets/data/authors.json'
import CopyIcon from "../../components/UI/icons/CopyIcon";
import InstagramIcon from "../../components/UI/icons/InstagramIcon";
import Facebook from "../../components/UI/icons/Facebook";
import TweeterIcon from "../../components/UI/icons/TweeterIcon";
import WebIcon from "../../components/UI/icons/WebIcon";

interface Picture {
  tokenId?: number,
  authors?: any[],
  name?: string,
  status?: string,
  collectionAddress?: string,
  description?: any[],
}

interface Author {
  id?: number,
  name?: string,
  avatar?: string,
  address?: string,
  collections?: number[],
  social?: any,
  description?: any
}

export const CardPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch()
  const { contract, currToken, loading, signerAddress, haveEth } = useAppSelector((state) => state.web3)
  const [nwidth, setNwidth] = useState<number>(0);
  const [nheight, setNheight] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<string>('')
  const [validate, setValidate] = useState<boolean>(false)
  const [picture, setPicture] = useState<Picture | undefined>()
  const [authors, setAuthors] = useState<Author[]>([])
  const [tags, _] = useState<string[]>(['abstract', 'digital', 'expressionist', 'psychedelic'])
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement | null>(null)

  const socialIcons = useMemo(() => ({
    "instagram": <InstagramIcon color="#888789" width="28" height="28" viewBox="0 0 28 28" />,
    "facebook": <Facebook color="#888789" width="34" height="28" viewBox="0 0 34 28" />,
    "twitter": <TweeterIcon color="#888789" width="17" height="28" viewBox="0 0 17 28" />,
    "site": <WebIcon color="#888789" width="44" height="44" viewBox="0 0 44 44" />
  }), [])

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

  useEffect(() => {
    if (id) {
      const pic = picData.find((pic) => pic.tokenId === Number(id))
      let auths: Author[] = [];
      if ((pic?.authors?.length || 0) > 1) {
        auths = pic?.authors.map((authorId) => {
          const author = authData.find((author) => author.id === authorId)
          console.log(author);
          return {
            ...author,
            avatar: author?.avatar ? require(`../../assets/images/${author.avatar}`) : './placeholder.png'
          }
        }) || []
      } else {
        const author = authData.find((author) => author.id === pic?.authors[0])
        auths = [
          {...author, avatar: author ? require(`../../assets/images/${author.avatar}`) : './placeholder.png'}
        ]
      }

      if (!pic) {
        navigate('/')
      } else {
        setPicture(pic)
        setAuthors(auths || [])
      }
    }
  }, [id, navigate])

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
      <Styled.CardTitle><span>#000{id}</span> ‘{picture?.name}’</Styled.CardTitle>
      <Styled.Authors>
        <span>By</span> {
          authors.reduce((accu: any, elem: any) => {
            return accu === null ? [elem?.name] : [...accu, <span> & </span> , elem?.name]
          }, null)
        }
      </Styled.Authors>

      <Styled.CardInfo>
        <Styled.CardInfoTitle>
          Description:
        </Styled.CardInfoTitle>
        <Styled.CardInfoText>
          {picture?.description}
        </Styled.CardInfoText>

        <Styled.CardInfoTitle>
          Collection:
        </Styled.CardInfoTitle>

        <Styled.ImageGroup>
          <Styled.ImageCollection src={
            require(`../../assets/images/collection_${collData.find(({ address }) => address === picture?.collectionAddress)?.id || 1}.png`)
          }/>
          <p>{collData.find(({ address }) => address === picture?.collectionAddress)?.name}</p>
        </Styled.ImageGroup>
        <Styled.Price>
          <span>Price: </span>10 BNB
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
      )}

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
      {
        authors.map((author) => (
          <Styled.AuthorBlock key={author.id}>
            <Styled.AuthorImage src={author?.avatar} />
            <Styled.AuthorName>{author.name}</Styled.AuthorName>
            <Styled.AuthorAddress>
              <CopyIcon viewBox='0 0 60 30' color="#999999" /> {author.address?.slice(0, 6)}...{author.address?.slice(37, 42)}
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
                Object.keys(author.social).map((key) => (socialIcons as any)[key])
              }
            </Styled.SocialBlock>
          </Styled.AuthorBlock>
        ))
      }
    </Styled.CardPage>
  )
}