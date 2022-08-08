import { ethers } from "ethers";
import _ from "lodash";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageCarousel } from "../../components/UI/ImageCarousel";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../store";
import { getTokens } from "../../store/reducer";

import * as Styled from './styles'

export const Main: React.FC = () => {
  const navigate = useNavigate()
  const { loading, tokens, contract } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()

  useEffect(() => {    
    // dispatch(getTokens(contract))
  }, [contract, dispatch])

  return (
    <Styled.MainBody>
      <Loader show={loading} />
      <Styled.MainHeader>
        <Styled.MainHeaderWrapper>
          <Styled.MainHeaderTitle>
            On the blockchain, art can take on any form.
          </Styled.MainHeaderTitle>
          <Styled.MainHeaderSubTitile>
            Artform
          </Styled.MainHeaderSubTitile>
        </Styled.MainHeaderWrapper>
      </Styled.MainHeader>
      <ImageCarousel title="Collection 1 / Ivan Shalmin [12]" images={[1, 2, 3, 4]} />
      <ImageCarousel title="Collection 2 / Shysha [10]" images={[5, 6, 7, 8, 9]} />

    </Styled.MainBody>
  )
}