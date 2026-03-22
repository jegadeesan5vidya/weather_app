import { getAirPollution } from "@/api"
import type { Coords } from "@/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, type Dispatch, type SetStateAction } from "react"
import Card from "./cards/Card"
import { Slider } from "./ui/slider"
import clsx from "clsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import Information from "/src/assets/information.svg?react"
import ChevronLeft from "/src/assets/chevron-left.svg?react"
import SidePanelSkeleton from "./skeletons/SidePanelSkeleton"

type Props = {
    coords: Coords, 
    isSidePanelOpen: boolean,
    setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>
}

/** 
 * This side bar component helps to show air pollution related info in a fixed popup.  
 * For this we will use Shad CN's sidebar component and also Shad CN CSS' sidebar color scheme
 * This side bar is going to be fixed one at top right side 
 * This side panel is also going to have shad cn slider, install it using below command
 * npx shadcn@latest add slider
*/
// For parameter, just refer it as props and pass it down to AirPolution component with the spread (...)
// This approach will helps us if we want to add few more props besides coords param from parent to child components
export default function SidePanel(props: Props) {
  // Destructure the props to get isSidePanelOpen, setSidePanelOpen properties and keep remaining props as it is
  const {isSidePanelOpen, setIsSidePanelOpen} = props
  console.log("isSidePanelOpen....", isSidePanelOpen)
  return (
    // --sidebar-width is a global variable defined in index.css
    // For large screen devices, no matter what the screen size is, we need to show the side panel automatically 
    // irrespective of isSidePanel true/false, and this can be done using the word 'lg-translate-x-0!'
    // here ! the important key is to force this style irrespective of isSidePanel 
    // Also we close the side panel when screen size is reduced or to suit small screen like 
    // mobile phone, to do this ''

    <div className={clsx("fixed top-0 right-0 h-screen w-(--sidebar-width) shadow-md bg-sidebar z-1001 py-8 px-4 overflow-y-scroll transition-transform duration-300 lg:translate-x-0!",
        isSidePanelOpen 
        ? 'translate-x-0'
        : 'translate-x-full'
      )}
    >
    <button onClick={()=> setIsSidePanelOpen(false)}>
      {// The side panel will be always shown for the bigger/larger screen.  So Chevron should be hidden 
      // if the window pixel is more than 1024 pixels for this add "lg:hidden", by default 
      // Chevron won't be hidden, but if scren pixel is more than 1024, it will be hidden 
      }
      <ChevronLeft className="size-8 -ml-2 lg:hidden"/>
      </button>
    <Suspense fallback={<SidePanelSkeleton />}>
        <AirPollution {...props}/>
    </Suspense>
    </div>
    )
}

// SuspenseQuery. Destructure the props here
const AirPollution = ({coords}: Props) => {
    const {data} = useSuspenseQuery({
        queryKey: ['airpolution', coords],
        queryFn: () => {return getAirPollution(coords) }, 
        })
    // Now return the React JSX which contains Air pollution info
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Air Pollution</h1>
            <div className="flex items-center gap-2">
              <h1 className="text-5xl font-semibold">AQI: {data?.list[0].main.aqi}</h1>
              <Tooltip>
                <TooltipTrigger > 
                    <Information className="size-4"/>
                </TooltipTrigger>
                <TooltipContent className="z-2000">
                  <p className="max-w-xs">Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.</p>
                </TooltipContent>
              </Tooltip>              
            </div>

            {/** The data contains an array list and we are going to use only the first item 
             * In below code we are going to display each air pollution components in each column
             * The following info (co, no, no2, o3, so2, pm2_5, pm10, nh3) available inside data.list[0].components
             * And these data are individual property and not an array/list.  In order to iterate this info (key and value pair), 
             * we use map method to iterate but using Object.entries(data.list[0].components) which return the key, values pair as list 
             */}
             {
                Object.entries(data.list[0].components).map(([key, value]) => 
                {
                    // Get the pollutant min, max range details for the given key 
                    // To silence the type error, tpyecast it using the keyword "as keyof typeof airQualityRanges" 
                    // in below stmt
                    const pollutantKey = pollutantMap[key as keyof typeof pollutantMap];

                    if (!pollutantKey) {
                    return; // skip pollutants not in AQI scale (like NO or NH3)
                    }

                    const pollutant = airQualityRanges[pollutantKey];

                    console.log("Pollutant:", pollutantKey);
                    console.log("Range:", pollutant);
                    console.log("Value from the API ", value)
                    // Get the min value to use it as max limit (since max value is set to NULL/infinity) for very poor 
                    // category, also we check the actual value  from the API and, if that value is more, then we take it, 
                    // otherwise min value will be used 
                    const max = Math.max(pollutant["Very Poor"].min, value);
                    // Based on the current value obtained from above air quality query, we determine 
                    // the range (good, fair, poor, etc) that pollutant falls into. Based on this current
                    // level, we show the color scheme to highlight to the user. Iterate using for loop 
                    // with destructuring this "Good: { min: 0, max: 20 }" into level and range 
                    const currentLevel = (() => {
                        for (const [level, range] of Object.entries(pollutant) ) {
                            if(range.max===null)
                            {
                              if (value < range.min)
                                return level
                              else return 'Very Poor'
                            }
                            else if(value >= range.min && (value <= range.max))
                            {
                                return level;
                            }
                        }
                    })() // define and call this anonomys function to get the result of the execution
                    // Get the quality color based on the current level
                    const qualityColor = qualityColorMap[currentLevel as keyof typeof qualityColorMap]
                    return (
                        <Card 
                            className="hover:scale-105 transition-transition duration-300 from-sidebar-accent to-sidebar-accent/60 gap-0!" 
                            childrenClassName="flex flex-col gap-3"
                            key={key}>
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="capitilize text-lg font-bold">{key.toUpperCase()}: </span>
                                  <Tooltip>
                                    <TooltipTrigger > 
                                        <Information className="size-4 "/>
                                    </TooltipTrigger>
                                    <TooltipContent className="z-2000">
                                      <p className="max-w-xs">{pollutantTipMap[key]}</p>
                                    </TooltipContent>
                                  </Tooltip>                                    
                                </div>
                                <span className="text-lg font-semibold">{value}</span>
                            </div>
                            {/** In below slider, we need to pass min, max and current value for the slider
                             * For each pollutant, we can refer to below type data (that was is generated by the ChatGPT using open weather html page)
                             * Refer to SO2's "Very Poor": { min: 350, max: null } range. here the very poor indication starts with 
                             * 350 and then max could be infinity. So we can take this 350 or the value from the API (refer to max 
                             * computation above) as max value for our slider pollutant  
                            */
                            }
                            <Slider min={0} max = {max} value={[value]} disabled />
                            <div className="flex justify-between text-xs">
                                <p>0</p> 
                                <p>{max}</p>
                            </div>
                            <div className="flex justify-between">
                            {
                                Object.keys(pollutant).map(quality => (
                                    <span className={clsx("px-2 py-1 rounded-md text-xs font-medium", 
                                        quality === currentLevel 
                                        ? qualityColor 
                                        : "bg-muted text-muted-foreground")}
                                    >
                                        {quality}
                                    </span>
                                ))
                            }
                            </div>
                        </Card>
                    )
                })

             }
        </div>
    )
}

// Types definition for Air Pollution quality components, which are generated based on the
// info given in under section Qualitative name below url
// https://openweathermap.org/api/air-pollution?collection=environmental
// Air quality levels
export type AirQualityLevel =
  | "Good"
  | "Fair"
  | "Moderate"
  | "Poor"
  | "Very Poor";

// Range definition
export interface Range {
  min: number;
  max: number | null;
}

const pollutantMap = {
  co: "CO",
  no2: "NO2",
  so2: "SO2",
  pm10: "PM10",
  pm2_5: "PM2_5",
  o3: "O3",
} as const;

const pollutantTipMap = {
  co: "Carbon Monoxide — a colorless gas from incomplete combustion; reduces oxygen delivery in the body.",
  no2: "Nitrogen Dioxide — produced mainly from vehicles and industry; irritates airways and worsens asthma.",
  so2: "Sulfur Dioxide — emitted from burning fossil fuels; can trigger breathing difficulties.",
  pm10: "PM10 — coarse particulate matter (dust, pollen, mold); can affect lungs and throat.",
  pm2_5: "PM2.5 — fine particulate matter from smoke and combustion; penetrates deep into lungs and bloodstream.",
  o3: "Ozone (O₃) — formed by chemical reactions in sunlight; causes chest pain and breathing issues.",
} as const;


const qualityColorMap = {
  "Good": "bg-green-500",
  "Fair": "bg-yellow-500",
  "Moderate": "bg-orange-500",
  "Poor": "bg-red-500",
  "Very Poor":"bg-purple-500",
  "": "bg-zinc-500",  // Default color
}

// Pollutants used by OpenWeather
export type Pollutant =
  | "SO2"
  | "NO2"
  | "PM10"
  | "PM2_5"
  | "O3"
  | "CO";

// Structure mapping pollutant -> AQI level -> range
export type AirQualityRanges = Record<
  Pollutant,
  Record<AirQualityLevel, Range>
>;

export const airQualityRanges: AirQualityRanges = {
  SO2: {
    Good: { min: 0, max: 20 },
    Fair: { min: 20, max: 80 },
    Moderate: { min: 80, max: 250 },
    Poor: { min: 250, max: 350 },
    "Very Poor": { min: 350, max: null },
  },

  NO2: {
    Good: { min: 0, max: 40 },
    Fair: { min: 40, max: 70 },
    Moderate: { min: 70, max: 150 },
    Poor: { min: 150, max: 200 },
    "Very Poor": { min: 200, max: null },
  },

  PM10: {
    Good: { min: 0, max: 20 },
    Fair: { min: 20, max: 50 },
    Moderate: { min: 50, max: 100 },
    Poor: { min: 100, max: 200 },
    "Very Poor": { min: 200, max: null },
  },

  PM2_5: {
    Good: { min: 0, max: 10 },
    Fair: { min: 10, max: 25 },
    Moderate: { min: 25, max: 50 },
    Poor: { min: 50, max: 75 },
    "Very Poor": { min: 75, max: null },
  },

  O3: {
    Good: { min: 0, max: 60 },
    Fair: { min: 60, max: 100 },
    Moderate: { min: 100, max: 140 },
    Poor: { min: 140, max: 180 },
    "Very Poor": { min: 180, max: null },
  },

  CO: {
    Good: { min: 0, max: 4400 },
    Fair: { min: 4400, max: 9400 },
    Moderate: { min: 9400, max: 12400 },
    Poor: { min: 12400, max: 15400 },
    "Very Poor": { min: 15400, max: null },
  },
};
