import { SvgIcon } from "@mui/material"

const ChevronIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <path fill="none" d="M18 10L10 2L2 10" stroke="white" strokeWidth="2" stroke-linecap="square"/>
    </SvgIcon>
  )
}

export default ChevronIcon;
