import { useState } from 'react';
import * as Styled from './styles';

export const Price: React.FC = () => {
  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);
  const [show, setShow] = useState<boolean>(true);

  const changeStart = (value: string) => {
    if (value.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      if (Number(value) < endPrice) {
        setStartPrice(Number(value))
      }
    }
  }

  const changeEnd = (value: string) => {
    if (value.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      setEndPrice(Number(value))
    }
  }

  return (
    <Styled.PriceBox opened={show}>
      <Styled.PriceTitle onClick={() => setShow(!show)} opened={show}>price</Styled.PriceTitle>
      <Styled.PriceFork>
        <Styled.PriceBoxInput value={startPrice} onChange={(e) => changeStart(e.target.value)} />
        <Styled.ForkLine />
        <Styled.PriceBoxInput value={endPrice} onChange={(e) => changeEnd(e.target.value)} />
      </Styled.PriceFork>
      <Styled.NameBlock>USD / <Styled.NameSpan>NSN</Styled.NameSpan> </Styled.NameBlock>
    </Styled.PriceBox>
  )
}