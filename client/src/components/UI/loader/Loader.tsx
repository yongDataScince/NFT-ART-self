import * as Styled from './styles'
import * as _ from 'lodash'

export const Loader: React.FC<{show?: boolean}> = ({ show }) => {
  return (
    <Styled.LoaderWrapper show={show}>
      <Styled.LoaderBox>
        {_.times(9).map((id) => <Styled.LoaderItem key={id} delay={id} />)}
      </Styled.LoaderBox>
    </Styled.LoaderWrapper>
  )
}