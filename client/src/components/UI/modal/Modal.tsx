import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
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
  variant?: 'error' | 'warning' | 'default';
  show?: boolean;
  message: string;
  title?: string
}

type Props = CommonProps & LinkProps

export const Modal: React.FC<Props> = ({ title, variant, message, haveLink, src, text, show }) => {
  const [active, setActive] = useState<boolean | undefined>(false)
  useEffect(() => {
    setActive(show)
  }, [show])

  return (
    <Styled.ModalBox variant={variant} show={active}>
      <Styled.ModalWrapper>
        <Styled.ModalClose variant={variant} onClick={() => setActive(false)}>
          <CloseIcon />
        </Styled.ModalClose>
        <Styled.ModalTitle variant={variant}>{title}</Styled.ModalTitle>
        <Styled.ModalMessage variant={variant}>
          {message}
          {haveLink && <Styled.ModalLink href={src}>{text}</Styled.ModalLink>}
        </Styled.ModalMessage>
      </Styled.ModalWrapper>
    </Styled.ModalBox>
  )
}