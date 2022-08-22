import { useState } from 'react'
import * as Styled from './styles'

export const Footer: React.FC = () => {
  const [links] = useState<{id: number, title: string,url: string, external: boolean}[]>([
    {id: 1, title: "About", url: "/info", external: false},
    {id: 2, title: "How it works", url:"/how-it-works", external: false},
    {id: 3, title: "Privacy Policy", url:"/privacy", external: false},
    {id: 4, title: "Contract", url:"https://testnet.bscscan.com/address/0x3fd0e2d4174e33ecf9b617f31238de46ad6737ac#readContract", external: true},
  ])
  return (
    <Styled.FooterMain>
      <Styled.FooterTitle>Neuform</Styled.FooterTitle>
      <Styled.FooterNav>
        {
          links.map((({ id, title, url, external }) => (
            external ? <Styled.ExternalLink href={url} key={id}>{title}</Styled.ExternalLink> : <Styled.InternalLink to={url} key={id}>{title}</Styled.InternalLink>
          )))
        }
      </Styled.FooterNav>
    </Styled.FooterMain>
  )
}