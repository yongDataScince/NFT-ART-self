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
    text: string[]
  }[]
}

export const Info: React.FC = () => {
  const [blocks, setBlock] = useState<Block[]>([
    {
      id: 1,
      opened: false,
      title: 'About Artform',
      description: 'We are an exclusive online art gallery. Curating, exhibiting and selling both digital and physical works, all verified on the blockchain.',
      subBlocks: [
        { id: 1, title: 'Our statement', text: [
          '<span style="color: #FFF">Neuform is a community of artists and collectors who value premium contemporary art with authentic skill and merit.</span>',
          `<span style="color: #FFF">We see NFTs for what they are - a digital certificate to guarantee the authenticity of your piece. This way, we don't limit the application of NFTs to just digital art. Instead, we believe that any work can become an NFT, be it an oil painting, a sculpture, or a piece of video art.`,
          `The platform’s primary goal is to introduce the fine art community into the blockchain space, thereby uniting artists and fine art connoisseurs from both the digital and the physical art space.`,
          `Neuform is a curated gallery focusing primarily on contemporary abstract art in any medium. `,
          `In order to ensure quality and consistency, our exhibiting artists have to go through an application process. If you wish to participate, your work will be assessed by our panel of judges. Unlike other curated NFT galleries, we are not concerned with the scale of your social media presence. Instead, we look for skillfully executed work that shows true talent. We also prefer creatives who have previously participated in exhibitions and art fairs, however this is not a requirement.</span>`
        ]},
        {
          id: 2,
          title: 'Benefits for artists',
          text: [
            `Neuform enables artists to safely navigate the blockchain and to make the most of it by providing them with all-round support, every step of the way. This includes informing and consulting collectors as well as creatives about a wide variety of topics; starting with the mechanics of an NFT, recommendations on blockchain selection, marketing, plus earnings and taxation within the crypto-space.    As a platform created by artists, we are passionate about art quality and authenticity, as well as the artist’s right to earn royalties from <span style="color: #FFF">secondary sales.</span>`,
            `As such, we are extremely proud to be the first-ever platform within the crypto-space to carefully design a scalable authorship royalty mechanism. This mechanism allows for an automatic adjustment, to enable the creator to earn their well deserved passive income from their work, whilst still upholding an adequate ratio of royalty to art piece price.`,
          ]
        },
        {
          id: 3,
          title: 'Benefits for collectors',
          text: [
            `The NFT space is mostly disconnected from the large-scale, traditional, collecting art world. Neuform invites conventional collectors into the crypto territory by making NFTs out of contemporary art pieces that wouldn’t normally appear on the blockchain.`,
            `In the meantime, our platform encourages NFT collectors from the crypto space to expand into the realm of fine art, to acquire more meaningful works and long-term investments. 
            We aim to create a thriving community of art lovers who will benefit from our educational videos, direct communication with artists, personal exhibition invitations and also exclusive deals during presale events.`,
          ]
        },
        {
          id: 4,
          title: `Roadmap for ‘22`,
          text: [
            `
            <span style="color: #FFF">August:</span><br/>Our first digital collection byIvan Shalmin & Sasha Shalmina - ‘Raw’<br/><br/>
            <span style="color: #FFF"> September:</span>Platform soft launch with our first digitalcollection<br/><br/>
            <span style="color: #FFF">October:</span><br/> First physical collection by Ivan Shalmin<br/><br/>
            <span style="color: #FFF">December:</span><br/> Platform ready to expand and exhibit more artists
            `
          ]
        }
      ]
    },
    {
      id: 2,
      opened: true,
      title: 'How it works',
      description: '',
      subBlocks: [
        {
          id: 1,
          title: 'Purchasing of artworks',
          text: [
            `Minting. In order to purchase a new artwork press the “mint” button. This way, the NFT token for your chosen artwork will be officially created on the blockchain and the first-time buyer will acquire the status of a minter. This is important because the minter is sometimes entitled to a first collector royalty fee (see the royalty section for details).`,
            `Presale. Occasionally, Neuform will announce exclusive presale events, which will be limited to a specific number of authorized, participating collectors. They will be admitted to an exclusive preview of the new collection and will also be able to make a purchase earlier than everyone else. In order to become a presale participant, the collector would have to become authorized by the platform. This can be done in your personal user area, once you connect your wallet.`,
            `Public sale. Typically, Neuform will be holding public sale events, that’s where a new collection becomes available for purchase for the very first time. Unlike the exclusive presale, these are open to everyone and are not limited to a certain number of participants.`
          ]
        },
        {
          id: 2,
          title: 'Create NFT collections with Neuform',
          text: [
            `In order to qualify as an exhibiting artist, you must submit an application, along with examples of your work. Your application will be assessed by our panel of judges and if you are successful, you will gain access to your personal user area, where you can start to publish your works. `,
            `Our platform can create your collection on any of the following blockchains: Ethereum, Polygon or Binance.`
          ]
        },
        {
          id: 3,
          title: 'Fees and royalties',
          text: [
            `For artists, there is a platform fee on all primary sales. That is, every time a brand new artwork is sold for the very first time. <span style="color: #FFF">This fee can be anywhere between 10% and 40% , depending on the status of the artist and their history within the platform.</span><br/><br/>There is also a platform fee for secondary sales, i.e. any resale of an artwork after the primary sale. <span style="color: #FFF">This fee is set at 3%</span>`,
            `<span style="color: #FFF">Artists will enjoy royalties for all secondary sales. If the value of their work increases over time, the royalty percentage will decrease proportionally.</span>`,
            `Minter benefits. Artists have the option to reward their very first collector for any given artwork, by giving them a small royalty on all of their secondary sales. This reward is completely optional and it decreases proportionally with each consecutive transaction. The number of transactions, as well as the percentage given to the minter is defined by each artist individually, is capped at 5%, and is announced separately for every new collection.`,
            `
            <span style="text-decoration: underline;">For example the artist will receive</span><br>
            <span style="color: #FFF;">10%</span> when an artwork is resold at <span style="color: #FFF;">500 € or less</span>,<br>
            <span style="color: #FFF;">4%</span> from a resale of <span style="color: #FFF;">501 - 50 000 €</span>,<br>
            <span style="color: #FFF";">2%</span> from a resale of  <span style="color: #FFF;">50 001 - 500 000 €</span> <br>
            <span style="color: #FFF;">0,2%</span> from a resale of anything above <span style="color: #FFF;">500 000 €</span>
            
            `
          ]
        }
      ]
    },
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
          <Styled.InfoBlock key={block.id} delay={!block.opened ? (( block.subBlocks.length * 0.2 ) / 1.007) : 0} opened={block.opened}>
            <Styled.InfoTitle onClick={() => openBlock(block.id)} opened={block.opened}>
              <ChevronIcon />
              {block.title}
            </Styled.InfoTitle>
            {
              block.description && <Styled.InfoBlockDescription opened={block.opened} delay={( 0.02 ) / 1.007}>{block.description}</Styled.InfoBlockDescription>
            }
            {
              block.subBlocks.map((sub, idx) => (
                <Styled.InfoDescriptionBlock key={sub.id} opened={block.opened} delay={(idx * 0.2) / 1.007}>
                  <Styled.InfoDescriptionBlockTitle>{sub.title}</Styled.InfoDescriptionBlockTitle>
                  {
                    sub.text.length > 0 && <Styled.InfoDescriptionBlockText>{sub.text.reduce((accu: any, elem: any) => {
                      return accu === null ? [<div dangerouslySetInnerHTML={{ __html: elem }} /> ] : [...accu, <><br/><br/></> , <div dangerouslySetInnerHTML={{ __html: elem }} />]
                    }, null)}</Styled.InfoDescriptionBlockText>
                  }
                </Styled.InfoDescriptionBlock>
              ))
            }
          </Styled.InfoBlock>
        ))
      }

    </Styled.MainInfo>
  )
}