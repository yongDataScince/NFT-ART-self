import * as Styled from './styles';
import HomeIcon from '../UI/icons/HomeIcon'
import { useRef, useState } from 'react';
import useOnClickOutside from '../../hooks/useClickOutside'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';

export const Header: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<null | HTMLDivElement>(null)
  const { haveEth } = useAppSelector((state) => state.web3)
  const navigate = useNavigate()

  useOnClickOutside(ref, () => setOpen(false))

  return (
    <Styled.HeaderBar>
      <Styled.HeaderButton>
        <Styled.Burger fontSize='medium' onClick={() => setOpen(true)} />
      </Styled.HeaderButton>
      <Styled.HeaderButton>
        <HomeIcon />
      </Styled.HeaderButton>
      <Styled.HeaderTitle>Artform</Styled.HeaderTitle>

      <Styled.MenuSwiper open={open} ref={ref}>
        <Styled.MenuSwiperTitle>Menu</Styled.MenuSwiperTitle>
        <Styled.MenuSwiperLinks>
          <Styled.MenuSwiperLink active onClick={() => {
            navigate('/')
            setOpen(false)
          }}>main</Styled.MenuSwiperLink>
          <Styled.MenuSwiperLink active={haveEth} onClick={() =>{
            if(haveEth) {
              navigate('/cabinet')
              setOpen(false)
            }
          }}>cabinet</Styled.MenuSwiperLink>
          <Styled.MenuSwiperLink active onClick={() => {
            navigate('/info')
            setOpen(false)
          }}>info</Styled.MenuSwiperLink>

        </Styled.MenuSwiperLinks>
      </Styled.MenuSwiper>
    </Styled.HeaderBar>
  )
}