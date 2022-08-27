import React, { useEffect, useState } from 'react';
import Header from './components/Header'
import Modal from './components/UI/modal';
import { Route, Routes,  } from 'react-router-dom'
import Main from './routes/Main'
import CardPage from './routes/CardPage'
import { initContract, setLoader } from './store/reducer';
import { useAppDispatch } from './store';
import Cabinet from './routes/Cabinet';
import Info from './routes/Info';
import { SettingsPage } from './routes/SettingsPage';
import { Author } from './routes/Author';

function App() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [variant, setVariant] = useState<'error' | 'warning' | 'default'>('default');
  const [linkSrc, setLinkSrc] = useState<string>('');
  const dispatch = useAppDispatch()

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
      dispatch(initContract({ haveEth: true })) 
    } else {
      dispatch(initContract({ haveEth: false })) 
      if (isMobileDevice()) {
        if (getMobileOS() === 'iOS') {
          setLinkSrc('https://apps.apple.com/ru/app/metamask-blockchain-wallet/id1438144202')
        } else {
          setLinkSrc('https://play.google.com/store/apps/details?id=io.metamask&hl=ru&gl=US')
        }
        setVariant('warning')
        setErrorMessage("Please install Metamask on your device")
      } else {
        setVariant('error')
        setErrorMessage("Please install Metamask on your device")
      }
    }
    (window as any).ethereum?.on("accountsChanged", () => {
      dispatch(setLoader(true))
      dispatch(initContract({ haveEth: true }))
    });
  }, [dispatch])

  return (
    <div className="app">
      <Header os={getMobileOS()} />
      <Modal title='Alert!' variant="default" message={errorMessage} haveLink src={linkSrc} text='Download here' show={errorMessage.length > 0} />
      <Routes>
        <Route element={<Main />} path='/' />
        <Route element={<Cabinet />} path='/cabinet' />
        <Route element={<Info />} path='/info' />
        <Route path='/collection/:collection/picture/:pictureid' element={<CardPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/author/:authorAddress' element={<Author />} />
      </Routes>
    </div>
  );
}

export default App;
