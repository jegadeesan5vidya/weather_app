import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
// Without below leaflet css, the map will show in disarray format.  To fix import this css and see the diff
import "leaflet/dist/leaflet.css"
import type { Coords } from "../types"
import { useEffect } from "react"
import { MaptilerLayer, MapStyle } from "@maptiler/leaflet-maptilersdk";



// Contains API source codes related to open weather
const API_KEY = import.meta.env.VITE_API_KEY
const TILE_API_KEY = import.meta.env.VITE_TILE_API_KEY

// Gt the onMapClick from the parent App and destructure it here, later pass it to <MapClick> 
// component to capture actual coordinates from the map
type Props = {
    coords: Coords,
    onMapClick: (lat: number, lon: number) => void, 
    mapType: string,
}

// Reack Leaflet gives a hook called use map which helps to get access to the map container that we are 
// referencing.  From the map, use map helps to hook into all sorts of events, control camera
// panning, zooming, also access to click event.  However this use map hook only be called from the
// MapContainer, otherwise it will not work.  How to manage this issue
// 1. we create a function (for e.g., MapClick) to use the useMap hook and this function is not doing any functional 
// other than initialization of useMap hook, just return null
// 2. Then render this MapClick inside the <MapContainer> component
// 3. Inside MapClick function manage all sorts of click events
export default function Map({coords, onMapClick, mapType}: Props) {
    //console.log("Inside map rendering with coords", coords)
  return (
    <div>
        <MapContainer 
            center={[coords.lat, coords.lon]} 
            zoom={5} style={{width:'100%', height:'500px'}}>
        <RecenterMap coords={coords} />         
        <MapClick onMapClick={onMapClick} />
        { // Below is the default tile layer, now replace it with custom MapTileLayer
        /** 
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        */
        }     
        <MapTileLayer />

        {/** We can add another tile layer to the map to show like Air temperature, Accumulated 
         * precipitation, Atmospheric pressure weather layers etc using open weather's API
         * TODO: Update below TileLayer
         * */
            // const url = `https://maps.openweathermap.org/maps/2.0/weather/1h/${mapType}/{z}/{x}/{y}?appid=${API_KEY}`
        }
        <TileLayer 
            opacity={0.7}
            url={`https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${API_KEY}`}
        />
        <Marker position={[coords.lat, coords.lon]}>
        </Marker>
        </MapContainer>
    </div>
  )
}

const MapClick = ({onMapClick}: {onMapClick: (lat: number, lon: number) => void}) => {
    const map = useMap()
    // Here you can manage all events that are related to the map referenced inside the <MapContainer>
    // map.on takes two params, 1. event, 2. event handler function, here the click event will be
    // triggered whenever we start clicking on the map
    map.on('click', (e) => {
        // We should have a pan effect, meaning if we click somewhere on the map, we should make 
        // that click point as new map center, so that the map move over the place where we clicked
        // panTo() method takes array object of two params, lat and lon which can be obtained 
        // from the event e object
        //console.log(e)
        const {lat, lng} = e.latlng
        map.panTo([lat, lng])
        // Call the onMapClick function to pass the lat, log coordinates from the map propagate 
        // to parenet App to pass down to open weather API to get the weather data for
        // selected map location
        onMapClick(lat, lng)
    } )
    return null
}

// Below component will help to recenter the map based on the lat/lon selection on the map
const RecenterMap = ({ coords }: { coords: Coords }) => {
  const map = useMap();
  // map.setView([coords.lat, coords.lon]);
  // With recenter animation to be smoother
  map.flyTo([coords.lat, coords.lon], map.getZoom());
  // This function is purely for having functionality and not returning any jsx to render, 
  // so just return null value   
  return null; 
};

// Example of using OpenMapTiles.org's map tiler, using map hook

const MapTileLayer = () => {
    const map = useMap()
    useEffect(() => {
        // Use SDK which was installed by command npm i  @maptiler/leaflet-maptilersdk 
        // This takes two args, 1. style object, 2. API KEY from open map tiler
        const tileLayer = new MaptilerLayer({ style: MapStyle.STREETS.NIGHT, apiKey: TILE_API_KEY })
        tileLayer.addTo(map)
        // Clean up after the use of map
        return () => {map.removeLayer(tileLayer)}
    }, []
    )
    // This function is purely for having functionality and not returning any jsx to render, 
    // so just return null value   
    return null;
}

/** Other Map Tiler Layer's style
 * 
MapStyle.STREETS
MapStyle.STREETS.DARK
MapStyle.STREETS.LIGHT
MapStyle.STREETS.PASTEL
MapStyle.STREETS.NIGHT

MapStyle.BASIC
MapStyle.BASIC.DARK
MapStyle.BASIC.LIGHT

MapStyle.OUTDOOR
MapStyle.OUTDOOR.DARK

MapStyle.DATAVIZ
MapStyle.DATAVIZ.DARK
MapStyle.DATAVIZ.LIGHT

MapStyle.SATELLITE
MapStyle.HYBRID
MapStyle.WINTER
MapStyle.WINTER.DARK
 * 
 */

