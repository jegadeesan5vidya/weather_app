// tsrfc

import Card from "./Card";
import WeatherIcon from "../WeatherIcon";
import { getWeather, getFreeWeatherData } from "../../api";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Coords } from "../../types";

type Props = {
    coords: Coords
}

export default function HourlyForecast({coords}: Props) {
  // Here we copy the useQuery content here, however the query will run only once in the 
  // beginning and re-use the data from cache,  hence no issue in reusing this code here
  // Instead of useQuery, use useSuspenseQuery
  // Pass the coordinates to below queryKey to get dynamic coordinates from the Map, 
  // otherwise, the query will use the default coordinates from the cache
  const {data, isLoading, error} = useSuspenseQuery({
        queryKey: ['weather', coords],
        queryFn: () => getWeather({lat:coords.lat, lon:coords.lon})
    })
    if (isLoading) return <div>Loading Hourly weather...</div>;
    if (error) return <div>Error loading hourly weather</div>;
        
  return (
    // Here below card shows 48 hours forecast in 48 colums, and page will have huge scroll 
    // bar horizontally. To avoid this we can add overflow-x-scroll to Card's class Name
    // to have scroll bar within the container    
    <Card title="Hourly Forecast(48 hours)" childrenClassName="flex gap-6 overflow-x-scroll">
        {
            data?.hourly.map((hour) => (
                <div key={hour.dt} className="flex flex-col gap-2 2xl:justify-between items-center p-2">
                    <p className="whitespace-nowrap 2xl:scale-110">
                        {                    
                        new Intl.DateTimeFormat('en-GB', 
                          {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: data.timezone}
                        ).format(new Date(hour.dt * 1000))
                        
                        }
                    </p>
                    <WeatherIcon src={hour.weather[0].icon} />
                    <p className="2xl:scale-110">{Math.round(hour.temp)}°C</p>
                </div>
            ))
        }
    </Card>
  )
}