import * as Styled from './styles';
import HomeIcon from '../UI/icons/HomeIcon'

export const Header: React.FC = () => {
  return (
    <Styled.HeaderBar>
      <Styled.HeaderButton>
        <Styled.Burger fontSize='medium' />
      </Styled.HeaderButton>
      <Styled.HeaderButton>
        <HomeIcon />
      </Styled.HeaderButton>
      <Styled.HeaderTitle>Artform</Styled.HeaderTitle>
    </Styled.HeaderBar>
  )
}