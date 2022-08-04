import { ethers } from "ethers";
import _ from "lodash";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../store";
import { getTokens } from "../../store/reducer";

import * as Styled from './styles'

export const Main: React.FC = () => {
  const navigate = useNavigate()
  const { loading, tokens, contract } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()

  useEffect(() => {    
    dispatch(getTokens(contract))
  }, [contract, dispatch])

  return (
    <Styled.MainBody>
      <Loader show={loading} />
      <Styled.MainWrapper>
        {tokens?.map((token) => (
          <Styled.MainCard key={token.id} onClick={() => navigate(`picture/${token.id}`)}>
            <Styled.MainCardImg src={token.image === 'placeholder' ? require(`./placeholder.png`) : token.image} />
            <Styled.MainCardFooter>
              <Styled.MainCardFooterTitle>{token.name}</Styled.MainCardFooterTitle>
              <Styled.CardInfo>current bid <Styled.CardPrice>{ethers.utils.formatEther(token.price)} BNB</Styled.CardPrice></Styled.CardInfo>
            </Styled.MainCardFooter>
          </Styled.MainCard>
        ))}
      </Styled.MainWrapper>
    </Styled.MainBody>
  )
}