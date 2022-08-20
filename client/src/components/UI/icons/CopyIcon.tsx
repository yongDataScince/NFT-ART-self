import { SvgIcon } from "@mui/material"

const CopyIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <g>
      <g>
        <polygon points="17.02,20.52 3.48,20.52 3.48,6.97 4.73,6.97 4.73,19.27 17.02,19.27" fill={props.color} />
      </g>
      <g>
        <g>
          <path d="M18.65,5.35v10.42H8.22V5.35H18.65 M19.9,4.1H6.97v12.92h12.92V4.1H19.9z" fill={props.color} />
        </g>
      </g>
    </g>
    </SvgIcon>
  )
}

export default CopyIcon;
