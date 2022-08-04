import * as Styled from './styles';

interface IColor {
  id: number;
  value: string;
  choised?: boolean;
}

interface Props {
  colors: IColor[]
}

export const Colors: React.FC<Props> = ({ colors }) => {

  return (
    <Styled.ColorsBox>
      <Styled.ColorsTitle>colour</Styled.ColorsTitle>
      <Styled.ColorList>
        {colors.map((color) => <Styled.ColorRad color={color.value} key={color.id} />)}
      </Styled.ColorList>
    </Styled.ColorsBox>
  )
}
