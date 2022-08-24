import { times } from "lodash";
import React from "react";
import Footer from "../../components/Footer";
import { ImageCarousel } from "../../components/UI/ImageCarousel";
import Loader from "../../components/UI/loader";
import { useAppSelector } from "../../store";
import * as Styled from './styles'

export const Main: React.FC = () => {
  const { loading, collections } = useAppSelector((state) => state.web3)

  return (
    <Styled.MainBody>
      <Loader show={loading} />
      <Styled.MainHeader>
        <Styled.MainHeaderWrapper>
          <Styled.MainHeaderTitle>
            On the blockchain, art can take on any form. Neuform - where digital meets physical
          </Styled.MainHeaderTitle>
          <Styled.MainHeaderSubTitile>
            neuform.art 
          </Styled.MainHeaderSubTitile>
        </Styled.MainHeaderWrapper>
      </Styled.MainHeader>
      {
        collections?.map((collection) => (
          <ImageCarousel
            collectionId={collection.id}
            collectionName={`${collection?.name}`}
            title={`${collection?.name} [${collection?.totalSupply}]`}
            images={times(collection.totalSupply)}
          />
        ))
      }
      <Footer />
    </Styled.MainBody>
  )
}