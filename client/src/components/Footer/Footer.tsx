import { useState } from 'react'
import Facebook from '../UI/icons/Facebook'
import InstagramIcon from '../UI/icons/InstagramIcon'
import TweeterIcon from '../UI/icons/TweeterIcon'
import * as Styled from './styles'


export const Footer: React.FC = () => {
  const [links] = useState<{id: number, title: string,url: string, external: boolean}[]>([
    {id: 1, title: "About", url: "/info", external: false},
    {id: 2, title: "How it works", url:"/info", external: false},
    {id: 3, title: "Privacy Policy", url:"/info", external: false},
    {id: 4, title: "info@neuform.art", url:"https://testnet.bscscan.com/address/0x3fd0e2d4174e33ecf9b617f31238de46ad6737ac#readContract", external: true},
  ])

  return (
    <Styled.FooterMain>
      <Styled.FooterTitle>Neuform</Styled.FooterTitle>
      <Styled.FooterNav>
        {
          links.map((({ id, title, url, external }) => (
            external ? <Styled.ExternalLink href={url} key={id}>{title}</Styled.ExternalLink> : <Styled.InternalLink smooth to={url} key={id}>{title}</Styled.InternalLink>
          )))
        }
      </Styled.FooterNav>
      <Styled.Icons>
        <a href='https://www.facebook.com/neuform.art/'><TweeterIcon color="#FFF" width="17" height="28" viewBox="0 0 17 28" /></a>
        <a href='https://www.instagram.com/neuform.art/'><InstagramIcon color="#FFF" width="28" height="28" viewBox="0 0 28 28" /></a>
        <a href='https://twitter.com/neuform_art'><Facebook color="#FFF" width="34" height="28" viewBox="0 0 34 28" /></a>
      </Styled.Icons>
      <Styled.CopyRight>
        NeuformⒸ 2022 all rights reserved.
      </Styled.CopyRight>
    </Styled.FooterMain>
  )
}