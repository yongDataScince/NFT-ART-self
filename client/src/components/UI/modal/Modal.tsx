import * as Styled from './styles'

type LinkProps = 
  | {
    haveLink?: boolean;
    src?: string;
    text?: string
  }
  | {
    haveLink: never;
    src?: never;
    text?: never
  }

interface CommonProps {
  variant?: 'error' | 'warning' | 'default',
  message: string
}

type Props = CommonProps & LinkProps

export const Modal: React.FC<Props> = ({ variant, message, haveLink, src, text }) => {
  return (
    <Styled.ModalBox variant={variant}>
      <Styled.ModalWrapper>
        <Styled.ModalTitle variant={variant}>Hello</Styled.ModalTitle>
        <Styled.ModalMessage variant={variant}>
          {message}
          {haveLink && <Styled.ModalLink href={src}>{text}</Styled.ModalLink>}
        </Styled.ModalMessage>
      </Styled.ModalWrapper>
    </Styled.ModalBox>
  )
}