import React, { useState } from "react";
import ChevronIcon from "../../components/UI/icons/ChevronIcon";
import * as Styled from './styles'

interface Block {
  id: number,
  opened?: boolean,
  title: string,
  description: string,
  subBlocks: {
    id: number,
    title: string,
    text: string
  }[]
}

export const Info: React.FC = () => {
  const [opened, setOpened] = useState<boolean>(false);

  const [blocks, setBlock] = useState<Block[]>([
    {
      id: 1,
      opened: true,
      title: 'About Artform',
      description: 'We are an exclusive online art gallery. Curating, exhibiting and selling both digital and physical works, all verifiedon the blockchain.',
      subBlocks: [
        { id: 1, title: 'Our values', text: `In the 1980s, Ivan was an active member of the Russian paper architecture movement and the works that he has produced during this period are still touring across the globe.

        In 2016, he began to produce digital abstract paintings, or 'paintings without paint', as he calls them. ‘They are paintless because they are made without paint, using pure colour and an 'RGB brush’.’ His works are formless, raw feelings, communicated through explosions of colour. The aim is to evoke an emotional response and to convey subtle imagery from his own subconscious to that of the viewer.
        
        In 2020, Ivan had his first solo exhibitions; one in Moscow and two in Novosibirsk. His curator was Kirill Svietliyakov, an art expert, critic and historian responsible for the latest trends and developments  at the Tretiyakov Gallery in Moscow.
        ` }
      ]
    }
  ])
  
  const openBlock = (id: number) => {
    setBlock(blocks.map((block) => ({
      ...block,
      opened: block.id === id ? !block.opened : block.opened
    })))
  }

  return (
    <Styled.MainInfo>
      {
        blocks.map((block) => (
          <Styled.InfoBlock opened={block.opened}  key={block.id}>
            <Styled.InfoTitle onClick={() => openBlock(block.id)}>
              <ChevronIcon />
              {block.title}
            </Styled.InfoTitle>
            <Styled.InfoBlockDescription>{block.description}</Styled.InfoBlockDescription>

            {
              block.subBlocks.map((sub) => (
                <Styled.InfoDescriptionBlock key={sub.id}>
                  <Styled.InfoDescriptionBlockTitle>{sub.title}</Styled.InfoDescriptionBlockTitle>
                  <Styled.InfoDescriptionBlockText>{sub.text}</Styled.InfoDescriptionBlockText>
                </Styled.InfoDescriptionBlock>
              ))
            }
          </Styled.InfoBlock>
        ))
      }

    </Styled.MainInfo>
  )
}