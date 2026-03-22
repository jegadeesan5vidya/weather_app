import { useSuspenseQuery } from '@tanstack/react-query';
import Card from './Card'
import { getWeather } from '../../api';
import WeatherIcon from '../WeatherIcon';
import type { Coords } from '../../types';

type Props = {
  coords: Coords
}

export default function DailyForecast({coords}: Props) {
  // Here we copy the useQuery content here, however the query will run only once in the 
  // beginning and re-use the data from cache,  hence no issue in reusing this code here
  // Instead of useQuery, use useSuspenseQuery
  // Pass the coordinates to below queryKey to get dynamic coordinates from the Map, 
  // otherwise, the query will use the default coordinates from the cache
  const {data, isLoading, error} = useSuspenseQuery({
        queryKey: ['weather', coords],
        queryFn: () => getWeather({lat:coords.lat, lon:coords.lon})
    })
    if (isLoading) return <div>Loading Daily weather...</div>;
    if (error) return <div>Error loading daily weather</div>;
    
  return (
     <Card title="Daily Forecast" childrenClassName="flex flex-col gap-4 2xl:justify-between">
        {data?.daily.map((day) => (
          <div key={day.dt} className="flex justify-between gap-4" >
          <p className="w-9">{
          // Here day.dt is unix timestamp in seconds, now use this to convert into React Date which
          // expects timestamp in milliseconds Hence we multiple it by 1000
          // After that we use toLocaleDateString to convert date into day portion (for e.g., Mon, Tue) 
          // with "undefined, {weekday: "short"}"
            new Date(day.dt * 1000).toLocaleDateString(undefined, {weekday: "short"})} </p>
            <div className="flex gap-2 items-cener gap-2 w-50">
            <WeatherIcon src={day.weather[0].icon}/>
            <span className="truncate">({day.weather[0].description})</span>
            </div>
            { // To add degree in windows keyboard, key-in alt and 0176 using number pad
            }
          <p>{Math.round(day.temp.day)}°C</p>
          <p className="text-gray-500/75">{Math.round(day.temp.min)}°C</p>
          <p className="text-gray-500/75">{Math.round(day.temp.max)}°C</p>
          </div>
          ))
        }
    </Card> 
  )
}