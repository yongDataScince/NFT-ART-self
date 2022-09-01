import * as Styled from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import CopyIcon from '../UI/icons/CopyIcon';
import SettingsIcon from '../UI/icons/SettingsIcon';
import { useAppDispatch, useAppSelector } from '../../store';
import { initContract } from '../../store/reducer';
import BackIcon from '../UI/icons/BackIcon';
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react';

const connectNetwork = async () => {
  await (window as any).ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainName: 'Poligon',
        chainId: `0x${Number(137).toString(16)}`,
        nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
        rpcUrls: ['https://polygon-rpc.com']
      }
    ]
  });
}

export const Header: React.FC<{ os: string }> = ({ os }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { needChain, haveEth } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()
  const { activate, active, chainId } = useWeb3React();

  useEffect(() => {
    dispatch(initContract({ haveEth: active }))
  }, [active, chainId, dispatch])

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
      
      {((os === 'iOS' || os === 'Android') && !needChain && !haveEth) && (
       <Styled.HeaderButton style={{ paddingBottom: 4 }}  onClick={() => window.open('dapp://neuform.art')}>
          <CopyIcon viewBox='0 0 20 20' color="#FFF" />
        </Styled.HeaderButton>
      )}
      {needChain && 
        <Styled.HeaderButton style={{ paddingBottom: 4 }} onClick={() => connectNetwork().then(() => dispatch(initContract({ haveEth: true, netConnected: true })))}>
          <CopyIcon viewBox='0 0 20 20' color="#fcba03" />
        </Styled.HeaderButton>
      }  
      <Styled.HeaderTitle onClick={() => navigate('/')}>
        Neuform
      </Styled.HeaderTitle>
    </Styled.HeaderBar>
  )
}