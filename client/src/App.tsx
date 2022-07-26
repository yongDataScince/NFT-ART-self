import React, { useEffect, useState } from 'react';
import Filters from './components/Filters';
import Header from './components/Header'
import Modal from './components/UI/modal';

function App() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [variant, setVariant] = useState<'error' | 'warning' | 'default'>('default');
  const [linkSrc, setLinkSrc] = useState<string>('');
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
      (window as any).ethereum.request({method:'eth_requestAccounts'}).then((res: any) => {
        console.log(res) 
      })
    } else {
      if (isMobileDevice()) {
        if (getMobileOS() === 'iOS') {
          setLinkSrc('https://apps.apple.com/ru/app/metamask-blockchain-wallet/id1438144202')
        } else {
          setLinkSrc('https://play.google.com/store/apps/details?id=io.metamask&hl=ru&gl=US')
        }
        setVariant('warning')
        setErrorMessage("please install Metamask on your device: " + getMobileOS())
      } else {
        setVariant('error')
        setErrorMessage("please install Metamask on your device")
      }
    }
  }, [])


  return (
    <div className="app">
      <Header />
      <Filters />
      <Modal variant={variant} message={errorMessage} />
      {errorMessage.length > 0 && <Modal variant={variant} message={errorMessage} haveLink src={linkSrc} text='Download here' />}
    </div>
  );
}

export default App;
