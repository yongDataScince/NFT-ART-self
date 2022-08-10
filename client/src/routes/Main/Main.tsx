import { times } from "lodash";
import React, { useEffect } from "react";
import { ImageCarousel } from "../../components/UI/ImageCarousel";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../store";
import * as Styled from './styles'

export const Main: React.FC = () => {
  const { loading, collections } = useAppSelector((state) => state.web3)
  const dispatch = useAppDispatch()

  useEffect(() => {    
    // dispatch(getTokens(contract))
  }, [collections, dispatch])

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
      {
        collections?.map((collection) => (
          <ImageCarousel
            collectionId={collection.id}
            title={`${collection.name} / ${collection.name} [${collection.totalSupply}]`}
            images={times(collection.totalSupply).map((i) => i + 1)}
          />
        ))
      }
    </Styled.MainBody>
  )
}