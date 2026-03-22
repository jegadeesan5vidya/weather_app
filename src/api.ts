import { weatherSchema } from "./schemas/weatherSchema"
import { currentWeather } from "./schemas/currentWeather"
import { GeoCodeSchema } from "./schemas/GeoCodeSchema"
import type { Coords } from "./types"
import { AirPollutionSchema } from "./schemas/AirPollutionSchema"

// Contains API source codes related to open weather
const API_KEY = import.meta.env.VITE_API_KEY

const getWeather = async ({lat, lon} : {lat: number, lon: number}) => {
    //console.log("new App Key", API_KEY)
    //alert("new App Key " + API_KEY)
    //const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    // API for city 
    // https://api.openweathermap.org/data/2.5/weather?q=Geelong&units=metric&appid=b4dd9b68ffdfce0ff8507fdbc294a529
    // Below one is PAID URL (v3.0) use it only after all coding and testing is done
    const url =`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    // Below one is FREE SAMPLE URL(v2.5), use it until all coding and testing is done
    ///// const url =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`

    const res = await fetch(url)
    const data = await res.json()
    //console.log("Updated Weather data is", data)
    return weatherSchema.parse(data) // For API 3.0 version
    ///// return currentWeather.parse(data) // Free API
}

const getFreeWeatherData = async ({lat, lon} : {lat: number, lon: number}) => {
    //console.log("new App Key", API_KEY)
    //alert("new App Key " + API_KEY)
    // API for city 
    // https://api.openweathermap.org/data/2.5/weather?q=Geelong&units=metric&appid=b4dd9b68ffdfce0ff8507fdbc294a529
    // Below one is FREE SAMPLE URL(v2.5), use it until all coding and testing is done
    const url =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    console.log("Weather data is", data)
    ///// return weatherSchema.parse(data) // For API 3.0 version
    return currentWeather.parse(data)
}

// Function to return lat/lon for the given city name

// const getGeoCode = async (city: string) => {
//     // Refer to https://openweathermap.org/api/geocoding-api?collection=other for more details
//     console.log("Inside getGeoCode method, and the city is ", city)
//     if(city) {
//         try {
//             const url =`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
//             const res = await fetch(url)
//             const data = await res.json()
//             console.log("Geo Location in lat/lon (....)", data)
//             const result = GeoCodeSchema.safeParse(data);
//             console.log("Result is ", result)
//             if (!result.success) {
//             console.error("GeoCode validation failed", result.error);
//             return null; // never return undefined
//             }
//             return result.data[0];
//         }
//         catch(error) {
//             console.log("Error while parsing the geo code" , error)
//             return null;
//         }
//     } else return null;
    
// }

const getGeoCode = async (city: string) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );

    const data = await res.json();
    console.log("Geo Location in lat/lon", data);

    // Basic sanity check (no Zod)
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid geocode response");
      return null;
    }
    const item = data[0];

    if (typeof item.lat !== "number" || typeof item.lon !== "number" || typeof item.name !== "string"
    ) {
      console.error("Geocode fields missing or invalid");
      return null;
    }
    return item;
  } catch (err) {
    console.error("Error while parsing the geo code", err);
    return null;
  }
};




const getLocationName = async (coords: Coords)  => {
  const {lat, lon} = coords
  try {
    const res = await fetch (`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`)
    const data = await res.json();
    //console.log("getLocationName", data);
    return data[0];
  }
  catch(error) {
    console.error("Error while running getLocationName function", error);
    return null;
  }
}

// Function to get Air Pollution info
const getAirPollution = async (coords: Coords) => {
 const {lat, lon} = coords
 try {
 const res = await fetch (`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    const data = await res.json();
    console.log("airPollutionInfo", data);
    return AirPollutionSchema.parse(data);
  }
  catch(error) {
    console.error("Error while running airPollutionInfo function", error);
    return null;
  }
}

export {getWeather, getFreeWeatherData, getGeoCode, getLocationName,getAirPollution }