import { queryOptions, useQuery } from '@tanstack/react-query'
import {getWeather} from './api'
import Card from './components/cards/Card'

/** This Weather APP is going to have a dashboard, which has multiple cards that holds  
 * various weather information like hourly, daily forecast, current weather etc., 
 * Will have master card componets (inside components folder) and inner child card 
 * components for sharable and resuablity purpose
 * 
*/


const App = () => {
    const {data, isLoading, error} = useQuery({
            queryKey:['weather'], 
            queryFn: () => getWeather({lat:-38.24, lon:144.3708})
            })
    console.log("Parent data:", data);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading weather</div>;

    return (
        <>

       <div className="p-4 bg-blue-500 text-white">
        Weather App and now the weather is:
      </div>

      <Card>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Card>

      <Card>
        <div>Location: {data?.name}</div>
        <div>Temperature: {data?.main.temp}°C</div>
        <div>Feels like: {data?.main.feels_like}°C</div>
        <div>Weather: {data?.weather[0].description}</div>
        <div>Wind: {data?.wind.speed} m/s</div>
        <div>Humidity: {data?.main.humidity}%</div>
      </Card>


        </>
  )
}

export default App