import * as Styled from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import CopyIcon from '../UI/icons/CopyIcon';
import SettingsIcon from '../UI/icons/SettingsIcon';
import { useAppDispatch, useAppSelector } from '../../store';
import { initContract } from '../../store/reducer';
import BackIcon from '../UI/icons/BackIcon';

const connectNetwork = async () => {
  await (window as any).ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainName: 'mumbai test',
        chainId: `0x${Number(80001).toString(16)}`,
        nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com']
      }
    ]
  });
}

function openMetaMaskUrl() {
  window.open("dapp://nft-art-preview.pages.dev")
}

export const Header: React.FC<{ os: string }> = ({ os }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { haveEth, needChain } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()

  return (
    <Styled.HeaderBar>
      {
        location.pathname !== '/' && <Styled.HeaderButton onClick={() => navigate(-1)} style={{ marginRight: 16 }}>
          <BackIcon viewBox='0 0 24 24' color="#FFF" />
        </Styled.HeaderButton>
      }
      {
        (haveEth && !needChain) && (
          <Styled.HeaderButton onClick={() => navigate('/settings')}>
            <SettingsIcon color="#FFF" />
          </Styled.HeaderButton>
        )
      }
      
      {((os === 'iOS' || os === 'Android') && !haveEth && !needChain) && (
       os !== 'iOS' ? (
        <Styled.HeaderButton style={{ paddingBottom: 4 }}  onClick={() => window.open('https://metamask.app.link/dapp/nft-art-preview.pages.dev/')}>
          <CopyIcon viewBox='0 0 20 20' color="#FFF" />
        </Styled.HeaderButton>
       ) : (
        <>
          <Styled.HeaderButton onClick={() => openMetaMaskUrl()}>
            <CopyIcon  viewBox='0 0 20 20' color="#FFF" />
          </Styled.HeaderButton>
        </>
       )
      )}
      {(needChain && haveEth) && 
        <Styled.HeaderButton style={{ paddingBottom: 4 }} onClick={() => connectNetwork().then(() => dispatch(initContract({ haveEth: true, netConnected: true })))}>
          <CopyIcon viewBox='0 0 20 20' color="#fcba03" />
        </Styled.HeaderButton>
      }
      <Styled.HeaderTitle onClick={() => navigate('/')}>Neuform</Styled.HeaderTitle>
    </Styled.HeaderBar>
  )
}