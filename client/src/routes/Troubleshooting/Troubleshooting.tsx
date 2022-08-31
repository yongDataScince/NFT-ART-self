import _ from 'lodash'
import { useMemo } from 'react'
import Footer from '../../components/Footer'
import * as Styled from './styles'

export const Troubleshooting: React.FC = () => {
  const data = useMemo(() => ([
    {
      image: require(`./screens/1.png`),
      text: `
        1. Make sure you have MetaMask app installed<br />
        2. When you open the MetaMask app, please open the menu button in the upper left corner
      `
    },
    {
      image: require(`./screens/2.png`),
      text: `
        3. Select “Browser” in the left slide bar menu
      `
    },
    {
      image: require(`./screens/3.png`),
      text: `4. Depending on the version of your MetaMask app, either open a new tab, or just start typing the url in the search line`
    },
    {
      image: require(`./screens/4.png`),
      text: `5. Please make sure to type www.neuform.art in the search line. Please do not omit the “www” symbols, this is important!`
    },
    {
      image: require(`./screens/6.png`),
      text: `6. Switch the network if the MetaMask app recommends it`
    }
  ]), [])
  return (
    <Styled.TroubleshootingMain>
      {data.map((data) => <>
        <span dangerouslySetInnerHTML={{ __html: data.text }} />
        <img src={data.image} alt="" />
      </>)}
      <Footer />
    </Styled.TroubleshootingMain>
  )
}