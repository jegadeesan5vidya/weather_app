import { type Dispatch, type SetStateAction } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } 
    from '../ui/select'

type Props = {
    mapType: string,
    setMapType: Dispatch<SetStateAction<string>>, // This is the way to type the setter function in react
}

export default function MapTypeDropDown({mapType, setMapType}: Props) {
  return (
    // To set the location that is selected -> Set value 
    // When the dropdown change, use onValueChange event to get the value and pass 
    // it to setLocation method to set the selected city as the location
    <Select 
        value={mapType} 
        onValueChange={(value) => {
            setMapType(value)
        }}
    >
    <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Map Type" />
    </SelectTrigger>
    {// Here use z-index with 1001 value to show the dropdown content over the map 
    }
    <SelectContent className="z-1001"> 
        <SelectGroup>
        {
            mapTypes.map((type)=> (
                <SelectItem key={type.value} value={type.value}>
                    {type.name}
                </SelectItem>
            ))
        }
        </SelectGroup>
    </SelectContent>
    </Select>
  )
}

const mapTypes = [
  { name: "Cloud coverage", value: "clouds_new" },
  { name: "Rain/snow intensity", value: "precipitation" },
  { name: "Precipitation", value: "precipitation_new" },
  { name: "Atmospheric pressure", value: "pressure_new" },
  { name: "Wind speed", value: "wind_new" },
  { name: "Temperature", value: "temp_new" },
];