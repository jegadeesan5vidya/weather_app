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
import MobileHeader from "./components/MobileHeader";
import { Hamburger } from "lucide-react";
import LightDarkToggle from "./components/LightDarkToggle";


// Refer to https://github.com/AustinDavisTech/WeatherApp?tab=readme-ov-file to install necessary plug-ins
/** This app is having toggling between light and dark mode using Tailwind and Shad CN utilities
 * 1. Set a switcher component from Shand CN to toggle between light and dark mode
 * 2. Refer to LightDarkToggle.tsx file for more details
 * 3. Wrap the app with a provider (for e.g., ThemeProvider) which has light and dark mode which 
 * helps to toggle between them .  The reason to have a provider at app level is to make sure every 
 * components including nested components inside the app has access to the light/dark theme mode
 * 4. Refer to ThemeProvider.tsx, after creating a provider wrap the JSX with this provider 
 * 
 */
const App = () => {
  const [coordinates, setCoords] = useState <Coords>({lat:-38.24, lon:144.3708})
  const [location, setLocation] = useState("Singapore") // Pass this location and setLocation to LocationDropDown component as props 
  const [mode, setMode] = useState<"city" | "map">("city");
  const [place, setPlace] = useState("")
  const [mapType, setMapType] = useState('clouds_new')
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ["geocode", {location}],
    queryFn: async () => {
      const res = await getGeoCode(location); 
      //console.log("Hello there location now is ", res)
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

  const onMapClick = (lat: number, lon: number) => {
    //console.log("Inside onMapClick method lat n lon", lat, lon)
    setCoords({lat, lon})
    setMode("map"); 
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

  return (
    <>
      {// In below div, for small screen, by default the width is 100%, But for other device display which breaks the LG point (i.e., above 1024 pixels), 
      // set the width based on a calculation of 100% of the device' dynamic viewport width (dvw) minus the side bar width (i.e., 23rem)
      // Refer to the calculation w-full lg:w-[calc(100dvw - var(--sidebar-width))]
      }
      <MobileHeader setIsSidePanelOpen={setIsSidePanelOpen} />
      <div className="flex flex-col p-6 pt-4 xs:pt-6  gap-8 w-full lg:w-[calc(100dvw-var(--sidebar-width))] 2xl:h-screen 2xl:min-h-[1200px]"> 
        <div className="flex flex-col gap-8 md:flex-row md:gap-4">
          <div className="flex flex-col gap-8 md:flex-row md:gap-4">
            <h2 className="text-1xl">Location:</h2>
            <LocationDropDown location={location}
              setLocation={setLocation}
              mode={mode} setMode={setMode}
            />
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:gap-4">
            <h2 className="text-1xl font-semibold whitespace-nowrap">Map Type:{" "}</h2>
            <MapTypeDropDown mapType={mapType}
              setMapType={setMapType}
            />
          <div className="ml-auto flex items-center gap-4">
            </div>
            <div className="hidden xs:block">
              <LightDarkToggle />
            </div>
             <button onClick={()=> setIsSidePanelOpen(true)}
              className="hidden xs:block">
                <Hamburger className="size-8 lg:hidden"/>
              </button>
          </div>            
        </div>
        {
          // We start grid column as 1 by default, as screen size grows, then increase col span 2 as 
          // it has more room to accomodate more info (style > "md:grid-cols-2") and then set 
          // cols-span to 2 (style > "md:col-span-2") to all cards including map
          // If the pixel size is more than 1536 or higher, ie., 2xl, then the gird should have 
          // 4 rows & 4 coloms (2xl:grid-cols-4 2xl:grid-rows-4) 
          // Map > takes up entire 4 columns (2xl:col-span-4) and 2 rows (2xl:row-span-2), 
          // Current Weather > takes up 2nd and 3rd row => 1 col span and 2xl:row-span-2 
          // Hourly & Additional info > takes up 2 col-span, this can be managed with md:col-span-2 and 2xl:row-span-1
          // We can order the display of JSX componets using order-1, order-2 etc
          // And we can change the order at 2xl size, swap the order for daily & hourly @2xl size

        }
          {
          // <div className="grid grid-cols-1 2xl:flex-1 2xl:min-h-0 md:grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-4 gap-4" >
          }
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-4 gap-4 min-h-0 flex-1">
          { // For the gird, the map is going to be central (or takes up entire width) 
          }
          <div className="relative h-140 col-span-1 md:col-span-2 2xl:col-span-4 2xl:row-span-2 order-1">
            <Map coords={coords} onMapClick={onMapClick} mapType={mapType}/>
            <MapLegend mapType={mapType} />
          </div>
          {// Suspense component does not have className, to apply any style wrap it around a div tag 
          // and apply it. So each div forms a gird item for each weather card (current, hourly, daily, additional info)
          // And their col-span is by default 1
          }
          <div className="col-span-1 2xl:row-span-2 order-2" >
            <Suspense fallback={<CurrentSkeleton />}>
              <CurrentWeather coords={coords} place={place}/>
            </Suspense>
          </div>
          <div className="col-span-1 order-3 2xl:order-4 2xl:row-span-2">
            <Suspense fallback={<DailySkeleton />}>
              <DailyForecast coords={coords} />
            </Suspense>
          </div>          
          <div className="col-span-1 md:col-span-2 2xl:row-span-1 order-4 2xl:order-3" >
            <Suspense fallback={<HourlySkeleton />}>
              <HourlyForecast coords={coords} />
            </Suspense>
          </div>
          <div className="col-span-1 md:col-span-2 2xl:row-span-1 order-5">
            <Suspense fallback={<AdditionalInfoSkeleton />}>
              <AdditionalInfo coords={coords} />
            </Suspense>
          </div>
        </div>
      </div>
      <SidePanel coords={coords} isSidePanelOpen={isSidePanelOpen} setIsSidePanelOpen={setIsSidePanelOpen}/>
    </>
  )
}

export default App