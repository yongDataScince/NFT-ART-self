import { SvgIcon } from "@mui/material"

const TweeterIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <path d="M11.2617 28V15.7441H15.8932L17 10.673H11.2617V7.39336C11.2617 6.00948 12.0354 4.65403 14.4962 4.65403H17V0.341232C17 0.341232 14.7219 0 12.5512 0C8.01644 0 5.05057 2.42654 5.05057 6.81517V10.673H0V15.7441H5.05057V27.9905H11.2617V28Z" fill={props.color || "#FFFFFF"}/>
    </SvgIcon>
  )
}

export default TweeterIcon;