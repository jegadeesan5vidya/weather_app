import { useSuspenseQuery } from "@tanstack/react-query";
import { getWeather } from "../../api";
import Card from "./Card";
import WeatherIcon from "../WeatherIcon";
import type { Coords } from "../../types";

type Props = {
    coords: Coords, 
    place: string,
}

export default function CurrentWeather({coords, place}: Props) {
  // Here we copy the useQuery content here, however the query will run only once in the 
  // beginning and re-use the data from cache,  hence no issue in reusing this code here
  // Instead of useQuery, use useSuspenseQuery
  //console.log("Inside Current Weather card....", coords)
  // Pass the coordinates to below queryKey to get dynamic coordinates from the Map, 
  // otherwise, the query will use the default coordinates from the cache
  //console.log("Current Place name is ", place)
  const {data, isLoading, error} = useSuspenseQuery({
        queryKey: ['weather', coords],
        queryFn: () => getWeather({lat:coords.lat, lon:coords.lon})
    })
    console.log("Current Weather Data is ", data )
    if (isLoading) return <div>Loading current weather...</div>;
    if (error) return <div>Error loading current weather</div>;    
  return (
    <Card title="Current Weather" className="md:pb-11" childrenClassName="flex flex-col items-center gap-6 2xl:justify-between">
        <div className="flex flex-col gap-2 items-center" key="current">
            <h2 className="text-6xl font-semibold text-center">
                {Math.round(data.current.temp)}°C
            </h2>
            <WeatherIcon className="size-12" src={data.current.weather[0].icon} />
            <h3 className="capitalize text-xl">{data.current.weather[0].description}</h3>
            <div className="flex flex-col gap-2" key="localDate">
                <p className="text-xl text-center">Local Date/Time: {place}</p>
                <h3 className="text-4xl xxs:text-3xl font-semibold">
                    {
                        // Here we convert the timestamp using local timezone (based on the location)
                        new Intl.DateTimeFormat('en-GB', 
                            {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: data.timezone}
                        ).format(new Date(data.current.dt * 1000))
                    }
                </h3>
            </div>
            {// w-full - spread the div across the full window
            }
            <div className="flex justify-between w-100 xxs:w-[95%]" key="feels_humidity_wind">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">Feels Like</p>
                    <p>{Math.round(data.current.feels_like)}°C</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">Humidity</p>
                    <p>{data.current.humidity}%</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">Wind</p>
                    <p>{data.current.wind_speed} km</p>
                </div>

            </div>
        </div>
    </Card>
  )
}