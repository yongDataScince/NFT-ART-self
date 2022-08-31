import React, { useEffect, useState } from 'react';
import Header from './components/Header'
import Modal from './components/UI/modal';
import { Route, Routes,  } from 'react-router-dom'
import Main from './routes/Main'
import CardPage from './routes/CardPage'
import { initContract, setLoader } from './store/reducer';
import { useAppDispatch, useAppSelector } from './store';
import Cabinet from './routes/Cabinet';
import Info from './routes/Info';
import { SettingsPage } from './routes/SettingsPage';
import { Author } from './routes/Author';
import { useWeb3React } from '@web3-react/core';
import { Troubleshooting } from './routes/Troubleshooting/Troubleshooting';

function App() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [linkSrc, setLinkSrc] = useState<string>('');
  const dispatch = useAppDispatch()
  const { haveEth } = useAppSelector((state) => state.web3)
  const { active } = useWeb3React();

  function isMobileDevice() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  }

  const getMobileOS = (): string => {
    const ua = navigator.userAgent
    if (/android/i.test(ua)) {
      return "Android"
    }
    else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return "iOS"
    }
    return "Other"
  }

  useEffect(() => {
    if ((window as any).ethereum) {
      dispatch(initContract({ haveEth: true, netConnected: true })) 
    } else {
      dispatch(initContract({ haveEth: false, netConnected: false })) 
    }
    (window as any).ethereum?.on("accountsChanged", () => {
      dispatch(setLoader(true))
      dispatch(initContract({ haveEth: true, netConnected: true }))
    });
  }, [dispatch])

  return (
    <div className="app">
      <Header os={getMobileOS()} />
      <Modal title='Alert!' variant="default" message={errorMessage} haveLink src={linkSrc} text='Download here' os={getMobileOS()} show={!haveEth} />
      <Routes>
        <Route element={<Main />} path='/' />
        <Route element={<Cabinet />} path='/cabinet' />
        <Route element={<Info />} path='/info' />
        <Route path='/collection/:collection/picture/:pictureid' element={<CardPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/troubleshooting' element={<Troubleshooting />} />
        <Route path='/author/:authorAddress' element={<Author />} />
      </Routes>
    </div>
  );
}

export default App;
