import { Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import Generator from '../../components/Generator'
import CopyIcon from '../../components/UI/icons/CopyIcon'
import { useAppSelector } from '../../store'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Styled from './styles'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'

export const Cabinet: React.FC = () => {
  const { signerAddress, haveEth } = useAppSelector((state) => state.web3)
  const [openSn, setOpenSn] = useState<boolean>(false)
  const [currColor, setCurrColor] = useState<string>("#FFFFFF")
  const navigate = useNavigate()
  const handleClose = () => {
    setOpenSn(false)
  }

  useEffect(() => {
    if (!haveEth) {
      navigate('/')
    }
  }, [haveEth])

  return (
    <Styled.CabinetMain>
      <Styled.CabinetHeader>
        <Styled.BackBtn onClick={() => navigate('/')}>
          <ArrowBackIcon sx={{ color: '#FFF' }} />
          back to home page
        </Styled.BackBtn>
      </Styled.CabinetHeader>
      {
        !haveEth && !signerAddress ? (
          <></>
        ) : (
          <>
            <Generator name={signerAddress} />
            <Styled.AddressField 
              onClick={() => {
                navigator.clipboard.writeText(signerAddress || '')
                setOpenSn(true)
              }}
              onMouseEnter={() => setCurrColor('#999999')}
              onMouseLeave={() => setCurrColor('#FFF')}
            >
              <CopyIcon viewBox='0 0 80 20' color={currColor} />
              {signerAddress}
            </Styled.AddressField>
          </>
        )
      }
      <Snackbar
        open={openSn}
        onClose={handleClose}
        message='copied' 
        autoHideDuration={300}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      />
      <Footer />
    </Styled.CabinetMain>
  )
}