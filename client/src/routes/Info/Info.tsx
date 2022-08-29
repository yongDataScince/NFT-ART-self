import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import ChevronIcon from "../../components/UI/icons/ChevronIcon";
import * as Styled from './styles'

interface Block {
  id: number,
  opened?: boolean,
  htmlId: string,
  title: string,
  description: string,
  subBlocks: {
    id: number,
    title: string,
    text: string[]
  }[]
}

export const Info: React.FC = () => {
  const { hash } = useLocation()
  const [blocks, setBlock] = useState<Block[]>([
    {
      id: 1,
      htmlId: 'about',
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
            <span style="color: #FFF"> September:</span><br/>Platform soft launch with our first digitalcollection<br/><br/>
            <span style="color: #FFF">October:</span><br/> First physical collection by Ivan Shalmin<br/><br/>
            <span style="color: #FFF">December:</span><br/> Platform ready to expand and exhibit more artists
            `
          ]
        }
      ]
    },
    {
      id: 2,
      opened: false,
      htmlId: 'how-it-works',
      title: 'How it works',
      description: '',
      subBlocks: [
        {
          id: 1,
          title: 'Purchasing of artworks',
          text: [
            `<span style="color: #FFF">Minting.</span> In order to purchase a new artwork press the “mint” button. This way, the NFT token for your chosen artwork will be officially created on the blockchain and the first-time buyer will acquire the status of a minter. This is important because the minter is sometimes entitled to a first collector royalty fee (see the royalty section for details).`,
            `<span style="color: #FFF">Presale.</span> Occasionally, Neuform will announce exclusive presale events, which will be limited to a specific number of authorized, participating collectors. They will be admitted to an exclusive preview of the new collection and will also be able to make a purchase earlier than everyone else. In order to become a presale participant, the collector would have to become authorized by the platform. This can be done in your personal user area, once you connect your wallet.`,
            `<span style="color: #FFF">Public sale.</span> Typically, Neuform will be holding public sale events, that’s where a new collection becomes available for purchase for the very first time. Unlike the exclusive presale, these are open to everyone and are not limited to a certain number of participants.`
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
            `Minter benefits. Artists have the option to reward their very first collector for any given artwork, by giving them a small royalty on all of their secondary sales. This reward is completely optional and it decreases proportionally with each consecutive transaction. The number of transactions, as well as the percentage given to the minter is defined by each artist individually, is capped at 5%, and is announced separately for every new collection.
            <br>
            <br>
            <span style="text-decoration: underline;">For example the artist will receive</span><br>
            <span style="color: #FFF;">10%</span> when an artwork is resold at <span style="color: #FFF; font-size: 13px;">500 € or less</span>,<br>
            <span style="color: #FFF;">4%</span> from a resale of <span style="color: #FFF; font-size: 13px;">501 - 50 000 €</span>,<br>
            <span style="color: #FFF";">2%</span> from a resale of  <span style="color: #FFF; font-size: 13px;">50 001 - 500 000 €</span> <br>
            <span style="color: #FFF;">0,2%</span> from a resale of anything above <span style="color: #FFF; font-size: 13px;">500 000 €</span>
            <br>
            <br>
            <span style="color: #FFF;">The number of transactions, as well as the percentage given to the minter is defined by each artist individually, is capped at 5%, and is announced separately for every new collection.</span>
            `,
          ]
        },
        {
          id: 4,
          title: "Physical NFT collections - coming soon!",
          text: [
            `
              As NFTs are digital certificates of artwork authenticity, we simply chip all the physical works in a collection with all the data necessary to confirm authenticity and to make it available on the blockchain. 
            `,
            `
              Physical NFTs are traded with the help of validators who approve the selling process. This way, if a current NFT owner wants to put their piece on sale, they hand it over to the validator, who carries out an assessment of the artwork condition and makes sure that it is in fact the NFT in question. Afterwards the seller may proceed with the sale.
              Any validator fees, as well as delivery costs from art owner to the validator are covered by the token owner.
              The first sale of a physical NFT does not require a validator, as the artworks are sold directly by the artist.
            `
          ]
        }
      ]
    },
    {
      id: 3,
      opened: false,
      htmlId: 'privacy-policy',
      title: 'Privacy Policy',
      description: '',
      subBlocks: [
        {
          id: 1,
          title: 'Privacy Policy for Neuform.art',
          text: [
            `At Neuform, accessible from http://neuform.art, one of our top priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Neuform.art and how we use it.`,
            `If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.`,
            `This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they share and/or collect in Neuform.art. This policy is not applicable to any information collected offline or via channels other than this website.`,
          ]
        },
        {
          id: 2,
          title: 'Consent',
          text: [
            `By using our website, you hereby consent to our Privacy Policy and agree to its terms.`
          ]
        },
        {
          id: 3,
          title: 'Information we collect',
          text: [
            `When you register for a personal user area, we may collect your name, email address, and digital wallet address. We may retain a history of the Art<br>Content you browse, sell, and/or purchase using our platform.`,
            `
              If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
              We maintain a social media presence on platforms like Instagram, Facebook and Twitter. When you interact with us on social media, we may receive personal information that you provide or make available to us based on your settings, such as your profile information. We also collect any social media profile information you directly provide us.
            `,
            `
              We may use the following technologies to collect Internet Activity Information:
              Cookies, which are text files stored on your device to uniquely identify your browser or to store information or settings in the browser to help you navigate between pages efficiently, remember your preferences, enable functionality, help us understand user activity and patterns, and facilitate online advertising.
            `,
            `
              Local storage technologies, like HTML5, that provide cookie-equivalent functionality but can store larger amounts of data, including on your device outside of your browser in connection with specific applications.
            `,
            `
              Web beacons, also known as pixel tags or clear GIFs, which are used to demonstrate that a webpage or email was accessed or opened, or that certain content was viewed or clicked.
            `,
            `
              Personal Information We Collect from Publicly Available Sources: We may collect identification information about you from publicly available blockchain networks, such as the Polygon, Ethereum and Binance blockchain.
            `
          ]
        },
        {
          id: 4,
          title: 'How we use your information',
          text: [
            `
              <span style="text-decoration: underline;">We use the information we collect in various ways, including to</span><br><br>
              Provide, operate, and maintain our website<br>
              Improve, personalize, and expand our website<br>
              Understand and analyze how you use our website,<br>
              develop new products, services, features, and functionality,<br>
              communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes<br>
              send you emails<br>
              Find and prevent fraud
            `
          ]
        },
        {
          id: 5,
          title: 'Personal Information Sharing',
          text: [
            `
            We may share personal information with:
            Service Providers, including hosting services, email services, advertising and marketing services, payment processors, customer support services, and analytics services.
            Professional Advisors, such as lawyers and accountants, where doing so is necessary to facilitate the services they render to us.<br> 
            Government Authorities, where required to do so for the Compliance and Protection purposes described above.<br>
            We may share information about platform creators under the infringement claim. In this case a creator’s data may be shared with individuals who claim that Art Content presented on the Neuform.art platform may infringe their intellectual property and other proprietary rights.
            Any transactions made on our platform are made through blockchain, thus, by design they are associated with your wallet, and are available to anyone interested.            
            `
          ]
        },
        {
          id: 6,
          title: 'Log Files',
          text: [
            `
              Neuform.art follows a standard procedure of using log files.<br>These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            `
          ]
        },
        {
          id: 7,
          title: 'Advertising Partners Privacy Policies',
          text: [
            `
            You may consult this list to find the Privacy Policy for each of the advertising partners of Neuform.art.<br>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Neuform.art, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising
            campaigns and/or to personalize the advertising content that you see on websites that you visit.          
            `,
            `
            Note that Neuform.art has no access to or control over these cookies that are used by third-party advertisers.
            `
          ]
        },
        {
          id: 8,
          title: 'Third Party Privacy Policies',
          text: [
            `
            Neuform.art's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.<br>
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
            `
          ]
        },
        {
          id: 9,
          title: 'CCPA Privacy Rights (Do Not Sell My Personal Information)',
          text: [
            `
              Under the CCPA, among other rights, California consumers have the right to:
              request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers,<br>
              request that a business delete any personal data about the consumer that a business has collected,<br>
              request that a business that sells a consumer's personal data, not sell the consumer's personal data,<br>
              If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.            
            `
          ]
        },
        {
          id: 10,
          title: 'GDPR Data Protection Rights',
          text: [
            `We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:`,
            `The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.`,
            `The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.`,
            `The right to erasure – You have the right to request that we erase your personal data, under certain conditions.`,
            `The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.`,
            `The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.`,
            `The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.`,
            `If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.`
          ]
        },
        {
          id: 11,
          title: "Children's Information",
          text: [
            `Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.`,
            `Neuform.art does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.`
          ]
        }
      ]
    }
  ])
  
  useEffect(() => {
    setBlock(blocks.map((b) => {
      if (`#${b.htmlId}` === hash) {
        return {
          ...b,
          opened: true
        }
      } else {
        return b
      }
    }))
  }, [hash])

  const openBlock = (id: number) => {
    setBlock(blocks.map((block) => ({
      ...block,
      opened: block.id === id ? !block.opened : block.opened
    })))
  }

  return (
    <Styled.MainInfo anyOpen={ blocks.some((b) => b.opened) }>
      {
        blocks.map((block) => (
          <Styled.InfoBlock key={block.id} id={block.htmlId} delay={!block.opened ? (( block.subBlocks.length * 0.2 ) / 1.007) : 0} opened={block.opened}>
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
                      return accu === null ? [<div dangerouslySetInnerHTML={{ __html: elem }} /> ] : [...accu, <><br/></> , <div dangerouslySetInnerHTML={{ __html: elem }} />]
                    }, null)}</Styled.InfoDescriptionBlockText>
                  }
                </Styled.InfoDescriptionBlock>
              ))
            }
          </Styled.InfoBlock>
        ))
      }

      <Footer />
    </Styled.MainInfo>
  )
}