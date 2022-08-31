import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CloseIcon from '../icons/CloseIcon';
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
  os?: string,
  message: string;
  title?: string
}

type Props = CommonProps & LinkProps

export const Modal: React.FC<Props> = ({ title, os, variant, message, haveLink, src, text, show }) => {
  const [active, setActive] = useState<boolean | undefined>(false)
  const navigate = useNavigate();

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
          {
            os === 'iOS' ? (
              <>
              Please, make sure you have metamask installed
              {haveLink && <Styled.ModalLink href={src}>{text}</Styled.ModalLink>}
              </>
            ) : (
              <>
                Please refer to our <span style={{ textDecoration: 'underline' }} onClick={() => navigate('/troubleshooting')}>troubleshooting</span> page in the footer menu, if Metamask doesn’t connect immediately 
              </>
            )
          }
        </Styled.ModalMessage>
      </Styled.ModalWrapper>
    </Styled.ModalBox>
  )
}