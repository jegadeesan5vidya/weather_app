import React, { type Dispatch, type SetStateAction } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } 
    from '../ui/select'

type Props = {
    location: string,
    setLocation: Dispatch<SetStateAction<string>>, // This is the way to type the setter function in react
    mode: "city" | "map";
    setMode: Dispatch<SetStateAction<"city" | "map">>;
}

export default function LocationDropDown({location, setLocation, mode, setMode}: Props) {
    //console.log("Inside location drop down, and the location is ", location)

  return (
    // To set the location that is selected -> Set value 
    // When the dropdown change, use onValueChange event to get the value and pass 
    // it to setLocation method to set the selected city as the location
    <Select 
        value={location} 
        onValueChange={(value) => {
            setLocation(value)
            setMode("city");
        }}
    >
    <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="City" />
    </SelectTrigger>
    {// Here use z-index with 1001 value to show the dropdown content over the map 
    }
    <SelectContent className="z-1001"> 
        {// If the location is custom i.e., selection from the map, then show 
        // custom in the drop down as selected
        }
        {location === 'custom' && (
            <SelectItem value="custom">Custom</SelectItem>
        )}
        <SelectGroup>
        {
            locations.map((city)=> (
                <SelectItem key={city.name} value={city.name}>
                    {city.name}
                </SelectItem>
            ))
        }
        </SelectGroup>
    </SelectContent>
    </Select>
  )
}

const locations = [
  { name: "New York", country: "USA" },
  { name: "Los Angeles", country: "USA" },
  { name: "London", country: "United Kingdom" },
  { name: "New Delhi", country: "India" },
  { name: "Mumbai", country: "India" },
  { name: "Bangalore", country: "India" },
  { name: "Chennai", country: "India" },
  { name: "Madurai", country: "India" },
  { name: "Paris", country: "France" },
  { name: "Dubai", country: "UAE" },
  { name: "Doha", country: "Qatar" },
  { name: "Singapore", country: "Singapore" },
  { name: "Tokyo", country: "Japan" },
  { name: "Osaka", country: "Japan" },
  { name: "Seoul", country: "South Korea" },
  { name: "Beijing", country: "China" },
  { name: "Shanghai", country: "China" },
  { name: "Hong Kong", country: "Hong Kong" },
  { name: "Bangkok", country: "Thailand" },
  { name: "Kuala Lumpur", country: "Malaysia" },
  { name: "Jakarta", country: "Indonesia" },
  { name: "Manila", country: "Philippines" },
  { name: "Sydney", country: "Australia" },
  { name: "Melbourne", country: "Australia" },
  { name: "Auckland", country: "New Zealand" },
  { name: "Toronto", country: "Canada" },
];