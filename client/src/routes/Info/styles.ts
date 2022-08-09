import styled, { css } from "styled-components";

interface Props {
  opened?: boolean
}

export const MainInfo = styled.div`
  width: 100%;
  min-height: 100vh;
  height: auto;
  padding: 112px 40px 120px 50px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`

export const InfoBlock = styled.div<Props>`
  width: 100%;
  transition: all 0.2s;
  border-bottom: 1px solid #CCCCCC;
  height: 100%;
  /* overflow-y: hidden; */
  ${({ opened }) => css`
    border-color: ${!opened ? '#CCCCCC' : '#000000'};
    max-height: ${!opened ? '60px' : '120%'};
  `}
`

export const InfoTitle = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 200;
  font-size: 52px;
  line-height: 100%;
  color: #FFFFFF;
  margin: 0;
  padding: 0;
  margin-bottom: 8px;
  position: relative;

  svg {
    position: absolute;
    left: -25px;
    top: 60%;
    transform: translateY(-50%);
  }
`

export const InfoBlockDescription = styled.p`
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: 100;
  font-size: 30px;
  line-height: 120%;
  color: #FFFFFF;
  padding: 0;
  margin: 40px 0 60px 0;
`

export const InfoDescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`

export const InfoDescriptionBlockTitle = styled.p`
  font-family: 'Helvetica Neue';
  font-size: 25px;
  color: #FFFFFF;
  font-weight: 300;
  border-bottom: 1px solid #CCCCCC;
  margin-bottom: 8px;
`

export const InfoDescriptionBlockText = styled.p`
  margin: 0;
  padding: 0;
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 120%;
  letter-spacing: -0.03em;
  color: #A3A0A0;
`
