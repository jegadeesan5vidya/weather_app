// Here we use custom class handler (clsx) to manage the image size as it will vary 
// in different places, adding an optional className props

import clsx from "clsx"

// To install clsx > npm install clsx
type Props = {
    src:string
    className?:string
}

// Here clsx takes first parameter as default one (and apply size-8) when no className 
// props is given, otherwise it takes given className value
export default function WeatherIcon({src, className}: Props) {
  return (
    <img className={clsx("size-8", className) }
        src={`https://openweathermap.org/payload/api/media/file/${src}.png`} 
        alt="Weather Icon"
    />
  )
}