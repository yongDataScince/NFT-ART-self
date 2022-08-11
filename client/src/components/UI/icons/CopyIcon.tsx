import { SvgIcon } from "@mui/material"

const CopyIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <path d="M40.9773 2H2V31.3309" fill="none" stroke={props.color} strokeWidth="3.5"/>
      <rect x="12.0234" fill="none" y="12.76" width="38.9773" height="29.3309" stroke={props.color} strokeWidth="3.5"/>
    </SvgIcon>
  )
}

export default CopyIcon;
