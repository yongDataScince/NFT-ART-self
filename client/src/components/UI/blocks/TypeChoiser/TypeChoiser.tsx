import * as Styled from './styles';

interface IType {
  id: number;
  value: string;
  choised?: boolean;
}

interface Props {
  title: string;
  types: IType[];
  onChoise: (id: number) => void
}

export const TypeChoiser: React.FC<Props> = ({ title, types, onChoise }) => {
  return (
    <Styled.ChoiserBox>
      <Styled.ChoiserTitle>{ title }</Styled.ChoiserTitle>
      <Styled.TypesList>
        {types.map((t) => <Styled.TypeCard choised={t.choised} key={t.id} onClick={() => onChoise(t.id)}>{t.value}</Styled.TypeCard>)}
      </Styled.TypesList>
    </Styled.ChoiserBox>
  )
}