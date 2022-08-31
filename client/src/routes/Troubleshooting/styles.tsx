import styled from "styled-components";

export const TroubleshootingMain = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  padding: 120px 26px;
  scroll-behavior: smooth;
  span {
    font-family: 'Helvetica Neue';
    font-style: normal;
    font-size: 25px;
    font-weight: 200;
    line-height: 27px;
    position: relative;
    letter-spacing: -0.02em;
    color: #FFF; 
    padding-left: 5px;
    margin-bottom: 10px;
  }
  img {
    width: 100%;
    margin-bottom: 40px;
  }
  footer {
    margin-top: 150px;
  }
`;