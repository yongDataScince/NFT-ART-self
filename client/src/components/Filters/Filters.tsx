import { useState } from 'react';
import ChevronIcon from '../UI/icons/ChevronIcon';
import FilterIcon from '../UI/icons/FilterIcon';
import Colors from './blocks/Colors';
import DropDown from './blocks/DropDown';
import Price from './blocks/Price';
import Size from './blocks/Size';
import TypeChoiser from './blocks/TypeChoiser';

import * as Styled from './styles';

interface IType {
  id: number;
  value: string;
  choised?: boolean;
}

interface IItem {
  id: number;
  name: string;
  choised?: boolean;
}

interface ISize {
  id: number;
  name: string;
  choised: boolean;
}

interface IColor {
  id: number;
  value: string;
  choised?: boolean;
}

export const Filters: React.FC = () => {
  const [opened, setOpened] = useState<boolean>(true);
  const [sizes, setSizes] = useState<ISize[]>([
    {id: 1, name: 'S', choised: false},
    {id: 2, name: 'M', choised: false},
    {id: 3, name: 'L', choised: false},
  ])
  const [items, setItems] = useState<IItem[]>([
    {name: 'portrait', id: 0},
    {name: 'nude', id: 1},
    {name: 'animals', id: 2},
    {name: 'landscape', id: 3},
    {name: 'technology', id: 4},
    {name: 'architecture', id: 5},
    {name: 'urban', id: 6},
    {name: 'nature', id: 7},
  ])
  const [colors, setColor] = useState<IColor[]>([
    {id: 0, value: '#FFFFFF'},
    {id: 1, value: '#5B5757'},
    {id: 2, value: '#7E21DB'},
    {id: 3, value: '#3F50EB'},
    {id: 4, value: '#15BCE0'},
    {id: 5, value: '#169549'},
    {id: 6, value: '#EECB4D'},
    {id: 7, value: '#EB8247'},
    {id: 8, value: '#E01B1B'},
    {id: 9, value: '#1B1A1D'},
    {id: 10, value: '#CBBCBC'},
    {id: 11, value: '#8F8585'},
    {id: 12, value: '#B08CD4'},
    {id: 13, value: '#7F8AED'},
    {id: 14, value: '#A7D4DE'},
    {id: 15, value: '#719780'}
  ])

  const [types, setTypes] = useState<IType[]>([
    { id: 0, value: 'live auction' },
    { id: 1, value: 'buy now' }
  ])

  const choiseSize = (id: number) => {
    setSizes(sizes.map((size) => ({
      ...size,
      choised: size.id === id
    })))
  }

  const choiseItem = (id: number) => {
    setItems(items.map((item) => ({
      ...item,
      choised: item.id === id ? !item.choised : item.choised
    })))
  }

  const choiseType = (id: number) => {
    setTypes(types.map((typ) => ({
      ...typ,
      choised: typ.id === id
    })))
  }

  return (
   <Styled.FiltersBox opened={opened}>
    <Styled.FilterHeader>
      <FilterIcon />
      <Styled.FiltersTitle>
        search filters 
      </Styled.FiltersTitle>
      <Styled.OpenButton opened={opened} onClick={() => setOpened(!opened)}>
        <ChevronIcon viewBox="0 0 22 10" />
      </Styled.OpenButton>
    </Styled.FilterHeader>
    <Styled.FilterBody>
      <Styled.FilterSection>
        <DropDown title='subject' items={items} onChoise={choiseItem} />
      </Styled.FilterSection>
      <Styled.FilterSection>
        <Price />
        <Size sizes={sizes} onChoise={choiseSize} />
        <Colors colors={colors} />
        <TypeChoiser title='auction type' types={types} onChoise={choiseType} />
      </Styled.FilterSection>
    </Styled.FilterBody>
   </Styled.FiltersBox>
  )
}