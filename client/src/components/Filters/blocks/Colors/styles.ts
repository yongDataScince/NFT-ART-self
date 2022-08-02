import styled from "styled-components";

export const ColorsBox = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 0.5px #CCCCCC solid;
  padding-bottom: 32px;
  margin-bottom: 16px;
`

export const ColorsTitle = styled.p`
  font-family: 'Helvetica';
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 100%;
  letter-spacing: -0.05em;
  color: #FFFFFF;
  margin: 0;
  padding: 0 0 0 16px;
  position: relative;
  margin-bottom: 54px;

  &::before {
    position: absolute;
    content: "-";
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #888789;
  }
`

export const ColorList = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`

export const ColorRad = styled.div<{color: string}>`
  width: 39px;
  height: 39px;
  margin: 0 14px 17px 0;
  background-color: ${({ color }) => color};
  border: 0.5px solid #FFFFFF;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    transform: scale(0.93);
  }
`

