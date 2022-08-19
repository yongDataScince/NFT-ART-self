import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom'
import CopyIcon from '../../components/UI/icons/CopyIcon';
import Facebook from '../../components/UI/icons/Facebook';
import InstagramIcon from '../../components/UI/icons/InstagramIcon';
import TweeterIcon from '../../components/UI/icons/TweeterIcon';
import WebIcon from '../../components/UI/icons/WebIcon';
import { Author as IAuthor, getAuthorByAddress } from '../../store/reducer';
import * as Styled from './styles'

export const Author: React.FC = () => {
  const { authorAddress } = useParams()
  const [author, setAuthor] = useState<IAuthor>()
  const [infoState, setInfoState] = useState<{ block: string, opened: boolean, text: string }[]>([])

  const socialIcons = useMemo(() => ({
    "instagram": <InstagramIcon color="#888789" width="28" height="28" viewBox="0 0 28 28" />,
    "facebook": <TweeterIcon color="#888789" width="17" height="28" viewBox="0 0 17 28" />,
    "twitter": <Facebook color="#888789" width="34" height="28" viewBox="0 0 34 28" />,
    "site": <WebIcon color="#888789" width="44" height="44" viewBox="0 0 44 44" />
  }), [])

  useEffect(() => {
    setAuthor(getAuthorByAddress(authorAddress || ''))
    setInfoState(
      Object.keys(getAuthorByAddress(authorAddress || '')?.description || {}).map((key) => ({
        block: key,
        opened: false,
        text: getAuthorByAddress(authorAddress || '')?.description[key]
      }))
    )
  }, [authorAddress])

  const toggleBlock = (block: string) => {
    console.log(block);
    setInfoState(infoState.map((info) => {
      if (info.block === block) {
        return {
          ...info,
          opened: !info.opened
        }
      }
      return info
    }))
  } 

  return (
    <Styled.AuthorMain>
      <Styled.AuthorHeaderImage src={require("./author_bg.png")} />
        <Styled.AuthorHeader>
          {
            author && <Styled.AuthorHeaderImg src={require(`../../assets/images/${author.avatar}`)} />
          }
          <Styled.AuthorHeaderTitle>{author?.name}</Styled.AuthorHeaderTitle>
          <Styled.CopyBlock onClick={() =>  navigator.clipboard.writeText(author?.address || '')}>
            <CopyIcon viewBox='0 0 60 30' color="#FFF" />
            {author?.address?.slice(0, 4)}...{author?.address?.slice(36, 41)}
          </Styled.CopyBlock>
        </Styled.AuthorHeader>
        <Styled.AuthorBody>
          {infoState.map((block) => (
            <Styled.InfoBlock key={block.block} opened={block.opened}>
              <Styled.InfoBlockTitle onClick={() => toggleBlock(block.block)}>+ {block.block}</Styled.InfoBlockTitle>
              <Styled.InfoBlockText opened={block.opened}>{block.text}</Styled.InfoBlockText>
            </Styled.InfoBlock>
          ))}
        </Styled.AuthorBody>
        <Styled.SocialBlock>
          {
            Object.keys(author?.social || {}).map((key) => (
              <a href={`${author?.social[key]}`} key={key}>{(socialIcons as any)[key]}</a>
            ))
          }
        </Styled.SocialBlock>
    </Styled.AuthorMain>
  )
}
