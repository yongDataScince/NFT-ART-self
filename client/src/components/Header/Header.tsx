import * as Styled from './styles';
import HomeIcon from '../UI/icons/HomeIcon'
import { useNavigate } from 'react-router-dom';
import CopyIcon from '../UI/icons/CopyIcon';
import SettingsIcon from '../UI/icons/SettingsIcon';

export const Header: React.FC<{ os: string }> = ({ os }) => {
  const navigate = useNavigate()

  return (
    <Styled.HeaderBar>
      <Styled.HeaderButton>
        <HomeIcon />
      </Styled.HeaderButton>
      <Styled.HeaderButton>
        <SettingsIcon />
      </Styled.HeaderButton>
      {(os === 'iOS' || os === 'Android') && (
        <Styled.HeaderButton style={{ marginLeft: 20 }} onClick={() => window.open('https://metamask.app.link/dapp/da376751.nft-art-preview.pages.dev/')}>
          <CopyIcon viewBox='0 0 60 30' color="#FFF" />
        </Styled.HeaderButton>
      )}
      <Styled.HeaderTitle onClick={() => navigate('/')}>Artform</Styled.HeaderTitle>
    </Styled.HeaderBar>
  )
}