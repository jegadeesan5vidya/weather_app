import React from 'react'
import Card from '../cards/Card'
import WeatherIcon from '../WeatherIcon'
import { Skeleton } from '../ui/skeleton'

type Props = {}
// This component will exactly look similar to the CurrentWeather.tsx's jsx content, 
// so copy them and paste it here
// And whereever we need the dynamic data, we use the Shad CN's skeleton component
// Install it using npx shadcn@latest add skeleton
// After that replace the dynamic data elements with <Skeleton /> component 
/** for e.g
 * replace below lines with <Skeleton />  and widht/lengh size should be same as org component
 * <h2 className="text-6xl font-semibold text-center">
        {Math.round(data.current.temp)}°C
   </h2>
 */
export default function CurrentSkeleton({}: Props) {
  return (
<Card title="Current Weather" 
    className="md:pb-11"
    childrenClassName="flex flex-col items-center gap-6 2xl:justify-between">
        <div className="flex flex-col gap-2 items-center" key="current">
            <Skeleton className="w-30 h-15"/>
            <Skeleton className="size-12 rounded-full"/>
            <Skeleton className="w-36 h-7"/>
            <div className="flex flex-col gap-2" key="localDate">
                <p className="text-xl text-center">Local Date/Time: </p>
                <Skeleton className="w-70 h-10"/>
             </div>
            {// w-full - spread the div across the full window
            }
            <div className="flex justify-between w-300" key="feels_humidity_wind">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">Feels Like</p>
                    <Skeleton className="w-16 h-6"/>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">Humidity</p>
                     <Skeleton className="w-16 h-6"/>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">Wind</p>
                    <Skeleton className="w-16 h-6"/>
                </div>
            </div>
        </div>
    </Card>
  )
}