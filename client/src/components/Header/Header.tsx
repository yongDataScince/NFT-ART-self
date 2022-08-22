import * as Styled from './styles';
import { useNavigate } from 'react-router-dom';
import CopyIcon from '../UI/icons/CopyIcon';
import SettingsIcon from '../UI/icons/SettingsIcon';
import { useAppSelector } from '../../store';

export const Header: React.FC<{ os: string }> = ({ os }) => {
  const navigate = useNavigate()
  const { haveEth } = useAppSelector((state) => state.web3)

  return (
    <Styled.HeaderBar>
      {
        haveEth && (
          <Styled.HeaderButton onClick={() => navigate('/settings')}>
            <SettingsIcon color="#FFF" />
          </Styled.HeaderButton>
        )
      }
      {(os === 'iOS' || os === 'Android') && (
        <Styled.HeaderButton onClick={() => window.open('https://metamask.app.link/dapp/nft-art-preview.pages.dev/')}>
          <CopyIcon viewBox='0 0 20 20' color="#FFF" />
        </Styled.HeaderButton>
      )}
      <Styled.HeaderTitle onClick={() => navigate('/')}>Neuform</Styled.HeaderTitle>
    </Styled.HeaderBar>
  )
}