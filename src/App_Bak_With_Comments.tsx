import { useQuery } from "@tanstack/react-query"
import {getGeoCode, getLocationName} from './api'
import DailyForecast from "./components/cards/DailyForecast";
import HourlyForecast from "./components/cards/HourlyForecast";
import CurrentWeather from "./components/cards/CurrentWeather";
import AdditionalInfo from "./components/cards/AdditionalInfo";
import Map from "./components/Map";
import { Suspense, useState } from "react";
import type { Coords } from "./types";
import LocationDropDown from "./components/dropdowns/LocationDropDown";
import MapTypeDropDown from "./components/dropdowns/MapTypeDropDown";
import MapLegend from "./components/MapLegend";
import CurrentSkeleton from "./components/skeletons/CurrentSkeleton";
import DailySkeleton from "./components/skeletons/DailySkeleton";
import HourlySkeleton from "./components/skeletons/HourlySkeleton";
import AdditionalInfoSkeleton from "./components/skeletons/AdditionalInfoSkeleton";
import SidePanel from "./components/SidePanel";


const App = () => {
  const [coordinates, setCoords] = useState <Coords>({lat:-38.24, lon:144.3708})
  const [location, setLocation] = useState("Singapore") // Pass this location and setLocation to LocationDropDown component as props 
  const [mode, setMode] = useState<"city" | "map">("city");
  const [place, setPlace] = useState("")
  const [mapType, setMapType] = useState('clouds_new')

  const { data } = useQuery({
    queryKey: ["geocode", {location}],
    queryFn: async () => {
      const res = await getGeoCode(location); 
      //console.log("Hello there location ", res)
      //console.log("Setting the location name (geocode method) ",res.name)
      setPlace(res.name)        
      return res;
    },
    enabled: location !== "custom", // do NOT fetch when map is clicked
  })

  const {data: locationName} = useQuery({
    queryKey: ['getLocationName', {coordinates}],
    queryFn: async () => {
      const res = await getLocationName(coordinates)
      //console.log("Setting the location name (getLocationName method) ",res.name)      
      setPlace(res.name)  
      return res;
    },
    enabled: location === "custom", // fetch only when map is clicked
  })

  //console.log("GeoCode data is ...", data)
  //console.log("From useQuery the locationName is ", locationName)
  // Define onMapClick function and pass it to Map component below, this would be executed 
  // whenever we click on the map, and update the coordinates at APP level, 
  // by using setCoords useState method
  const onMapClick = (lat: number, lon: number) => {
    //console.log("Inside onMapClick method lat n lon", lat, lon)
    setCoords({lat, lon})
    setMode("map"); 
    // Here we use 'custom' to differtiate between selecting coords from map or 
    // city from the dropdown
    //console.log("Setting the location as custom")
    setLocation("custom")
  }

  // if location is 'custom', then to get the lat/lon use lat/lon return from the 
  // map component, otherwise use the location's lat/lon obtained from getGeoCode method
  const coords = location === "custom"
    ? coordinates // lat/lon From the map
    : data 
      ? {lat: data.lat, lon: data.lon } // lat/lon From the location dropdown with fall back 0,0 if the value is undefined
      : coordinates; // If data is empty, then set coordinates

  //console.log("New Coordinates",coords)

  /** What is Skeleton loading? - Basically some indication that the page is loading some 
   * data or fetching info from some API or backend.  Use Shand CN's skeleton component
   * The suspenseQuery will help us to wrap inside a suspense component in React - which 
   * allow us to have a fall back component, if the query components takes bit of time to fetch the data 
   * Create a new suspense component folder to create suspense component for each of our weather cards
   * For e.g., refer to CurrentSkeleton.tsx, HourlySkeleton.tsx etc
   */

  return (
    <>
      {/* Paid URL results */}
      <div className="flex flex-col gap-8"> 
        <div className="flex gap-8">
          <div className="flex gap-4">
            <h2 className="text-1xl">Location:</h2>
            <LocationDropDown location={location}
              setLocation={setLocation}
              mode={mode} setMode={setMode}
            />
          </div>
          <div className="flex gap-4">
            <h2 className="text-1xl">Map Type:</h2>
            <MapTypeDropDown mapType={mapType}
              setMapType={setMapType}
            />
          </div>
        </div>
        <div className="relative">
          <Map coords={coords} onMapClick={onMapClick} mapType={mapType}/>
          <MapLegend mapType={mapType} />
        </div>
        {// This React's Suspense component gives a fall back while the CurrentWeather componet's 
        // query (which should be using useSuspenseQuery) is fetching data from API/Backend
        // Important thing is, the Skeleton component should have exact widht/height similar to
        // the oroginal component, so that when the data is loading, both skeleton and original 
        // component size looks same, otherwise mismatch visuals will be noted by the user.  
        // To eact exact size, use DevTools elements option to check the size pixels of the 
        // original and divide it by 4.  for e.g., if original component height is 32, then give 
        // skeleton component height as 8 (32/4)
        }
        <Suspense fallback={<CurrentSkeleton />}>
          <CurrentWeather coords={coords} place={place}/>
        </Suspense>
        <Suspense fallback={<HourlySkeleton />}>
          <HourlyForecast coords={coords} />
        </Suspense>
        <Suspense fallback={<DailySkeleton />}>
          <DailyForecast coords={coords} />
        </Suspense>
        <Suspense fallback={<AdditionalInfoSkeleton />}>
          <AdditionalInfo coords={coords} />
        </Suspense>
      </div>
      <SidePanel />
    </>
  )
}

export default App