import * as Styled from './styles';
import { useNavigate } from 'react-router-dom';
import CopyIcon from '../UI/icons/CopyIcon';
import SettingsIcon from '../UI/icons/SettingsIcon';
import { useAppDispatch, useAppSelector } from '../../store';
import { initContract } from '../../store/reducer';

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

export const Header: React.FC<{ os: string }> = ({ os }) => {
  const navigate = useNavigate()
  const { haveEth, needChain } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()

  return (
    <Styled.HeaderBar>
      {
        (haveEth && !needChain) && (
          <Styled.HeaderButton onClick={() => navigate('/settings')}>
            <SettingsIcon color="#FFF" />
          </Styled.HeaderButton>
        )
      }
      
      {((os === 'iOS' || os === 'Android') && !haveEth && !needChain) && (
        <Styled.HeaderButton onClick={() => window.open('https://metamask.app.link/dapp/nft-art-preview.pages.dev/')}>
          <CopyIcon viewBox='0 0 20 20' color="#FFF" />
        </Styled.HeaderButton>
      )}
      {(needChain && haveEth) && 
        <Styled.HeaderButton onClick={() => connectNetwork().then(() => dispatch(initContract({ haveEth: true, netConnected: true })))}>
          <CopyIcon viewBox='0 0 20 20' color="#fcba03" />
        </Styled.HeaderButton>
      }
      <Styled.HeaderTitle onClick={() => navigate('/')}>Neuform</Styled.HeaderTitle>
    </Styled.HeaderBar>
  )
}