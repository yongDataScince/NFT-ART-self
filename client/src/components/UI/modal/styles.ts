import styled from 'styled-components';

const colors = {
  'error': '#EE204D',
  'warning': '#FFCF40',
  'default': '#FFFFFF'
}

interface Props {
  variant?: 'error' | 'warning' | 'default'
}

export const ModalBox = styled.div<Props>`
  position: fixed;
  width: 90%;
  height: 30%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #000000;
  border: 1px solid ${({ variant }) => colors[variant || 'default']};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  overflow: hidden;
`

export const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const ModalTitle = styled.p<Props>`
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 31.25px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: ${({ variant }) => colors[variant || 'default']};
  padding: 0;
  margin: 0;
  margin-bottom: 20px;
`

export const ModalMessage = styled.div<Props>`
  border: 1px solid ${({ variant }) => colors[variant || 'default']};
  width: 100%;
  height: 80%;
  padding: 15px;
  text-align: center;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: -0.05em;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${({ variant }) => colors[variant || 'default']};
`

export const ModalLink = styled.a<Props>`
  color: ${({ variant }) => colors[variant || 'default']};
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: -0.05em;
  margin-top: 10px;
`
