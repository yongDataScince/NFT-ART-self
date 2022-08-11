import { SvgIcon } from "@mui/material"

const WebIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <path d="M42.7177 22.0363C42.7177 28.0505 40.172 33.4601 36.1148 37.2628C32.3917 40.7472 27.3639 42.8951 21.8588 42.8951C10.3395 42.8951 1 33.5556 1 22.0363C1 10.5329 10.3395 1.19336 21.8588 1.19336C27.3639 1.19336 32.3917 3.34129 36.1148 6.82572C40.172 10.6284 42.7177 16.038 42.7177 22.0363Z" fill="none" stroke={props.color || '#FFF'} strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M32.4401 22.0363C32.4401 28.0505 31.1514 33.4601 29.0989 37.2628C27.2056 40.7472 24.6599 42.8951 21.8755 42.8951C16.0363 42.8951 11.2949 33.5556 11.2949 22.0363C11.2949 10.5329 16.0363 1.19336 21.8755 1.19336C24.6599 1.19336 27.2215 3.34129 29.0989 6.82572C31.1514 10.6284 32.4401 16.038 32.4401 22.0363Z" fill="none" stroke={props.color || '#FFF'} strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M21.8594 1.19336V42.2746" stroke={props.color || '#FFF'} strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M1 21.8453H42.7177" stroke={props.color || '#FFF'} strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M4.46875 11.217H39.4562" stroke={props.color || '#FFF'} strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M3.94336 32.4736H39.5036" stroke={props.color || '#FFF'} strokeWidth="1.5" strokeMiterlimit="10"/>
    </SvgIcon>
  )
}

export default WebIcon;
