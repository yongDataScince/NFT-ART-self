import * as Styled from './styles';

interface ISize {
  id: number;
  name: string;
  choised: boolean;
}

interface Props {
  sizes: ISize[];
  onChoise: (id: number) => void
}

export const Size: React.FC<Props> = ({ sizes, onChoise }) => {

  return (
    <Styled.SizeBox>
      <Styled.SizeTitle>size</Styled.SizeTitle>
      <Styled.SizeList>
        {sizes.map((size) => <Styled.SizeCard
          onClick={() => onChoise(size.id)}
          key={size.id}
          choised={size.choised}>
            {size.name}
          </Styled.SizeCard>
        )}
      </Styled.SizeList>
    </Styled.SizeBox>
  )
}