import { useSuspenseQuery } from "@tanstack/react-query";
import { getWeather } from "../../api";
import Card from "./Card"

// here Adding .svg as react component.  '?react' will mark this svg as React component 
// and ready to use it
import Sunrise from '/src/assets/sunrise.svg?react'
import Sunset from "/src/assets/sunset.svg?react"
import Cloud from "/src/assets/cloud.svg?react"
import Pressure from "/src/assets/pressure.svg?react"
import UV from "/src/assets/uv.svg?react"
import Wind from "/src/assets/wind.svg?react"
import UpArrow from "/src/assets/uparrow.svg?react"
import type { Coords } from "../../types";

type Props = {
    coords: Coords
}

  // Pass the coordinates to below queryKey to get dynamic coordinates from the Map, 
  // otherwise, the query will use the default coordinates from the cache
export default function AdditionalInfo({coords}: Props) {
    const {data, isLoading, error} = useSuspenseQuery({
        queryKey: ['weather', coords],
        queryFn: () => getWeather({lat:coords.lat, lon:coords.lon})
    })
    if (isLoading) return <div>Loading Additional Weather Data...</div>;
    if (error) return <div>Error loading Additional Weather Data</div>;

  return (
    <Card title="Additional Weather Info" 
      childrenClassName="grid grid-cols-1 md:grid-cols-2 gap-8">
        {
            rows.map(({label, value, Icon}) => (
                <div className="flex justify-between" key={value}>
                    <div className="flex gap-4"> 
                        <span className="text-gray-400">{label}</span>
                        {// Here invert will reverse the color of the SVG Icon - when dark mode is selected 
                        // Note: However instead of using invert (or spamming) all the over the places, we go/refer to index.css
                        // Have a style in index.css as below, for any svg that we see on dark we apply the filter
                        //  invert(1)
                        /**  .dark svg { 
                                filter: invert(1);
                             }
                        */ 
                            
                        }
                        <Icon className="size-8"/> 
                    </div>                        
                    <span>
                        <FormmateComponent value={value} number={data.current[value]} timezone={data.timezone} />
                    </span>
                </div>
            )

            )
        }
    </Card>
  )
}

// Since we are not going to push or pop any value into this rows, here just define 
// a const variable called rows of data to iterate through data weather to get respective 
// value. However this definition will give Typescript error.  To avoid this error, we should 
// declare this array like const rows = [...] as const   
// 
const rows = [
  {
    label: "Cloudiness (%)",
    value: "clouds",
    Icon: Cloud,
  },
  {
    label: "UV Index",
    value: "uvi",
    Icon: UV,
  },
  {
    label: "Wind Direction (°)",
    value: "wind_deg",
    Icon: Wind,
  },
  {
    label: "Pressure (hPa)",
    value: "pressure",
    Icon: Pressure,
  },
  {
    label: "Sunrise",
    value: "sunrise",
    Icon: Sunrise,
  },
  {
    label: "Sunset",
    value: "sunset",
    Icon: Sunset,
  }
] as const;

// Some of values would be dates, so we need to formate them, for this will have 
// another react function that helps with the formatting

const FormmateComponent = ({value, number, timezone} : {value:string, number:number, timezone:string}) => {

    if(value=== 'sunrise' || value === 'sunset')
    {
        return new Intl.DateTimeFormat('en-GB', 
                          {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: timezone}
                      ).format(new Date(number * 1000))
        // return new Date(number * 1000).toLocaleTimeString(undefined, {
        //     hour: "numeric", 
        //     minute: "2-digit", 
        //     hour12: true
        // })
    }

    // Here if additional info is Wind direction (degree), then we use Up Arrow and use 
    // transform style to rotate to the given wind degree
    if(value === 'wind_deg') {
        return <UpArrow className="size-8" style={{transform: `rotate(${number}deg)`}}/>
    }
    return number;
}