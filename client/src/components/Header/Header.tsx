import * as Styled from './styles';
import HomeIcon from '../UI/icons/HomeIcon'
import { useRef, useState } from 'react';
import useOnClickOutside from '../../hooks/useClickOutside'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import CopyIcon from '../UI/icons/CopyIcon';

export const Header: React.FC<{ os: string }> = ({ os }) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<null | HTMLDivElement>(null)
  const { haveEth } = useAppSelector((state) => state.web3)
  const navigate = useNavigate()

  useOnClickOutside(ref, () => setOpen(false))

  return (
    <Styled.HeaderBar>
      <Styled.HeaderButton>
        <HomeIcon />
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