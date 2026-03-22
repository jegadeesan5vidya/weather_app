import React from 'react'

type Props = {
    mapType: string,
}

export default function MapLegend({mapType}: Props) {
  
// Select the legend data based on the mapType from mapTypeData record
const data = mapTypeData[mapType]
if (data) {
    const minValue = data.stops[0].value
    const maxValue = data.stops[data.stops.length-1].value
    // Here building the gradient for the selected legend using the data from mapTypeData
    // by mapping each stop point to its color
    // For css (go know where each color goes) - we need to give each gradient a position 
    // in percentage basis, meaning bottom value should start with 0% to top gradient 
    // % based on the stop values - For this %, get the current value from stop and divide by max value
    // In this case first row of mapTypeData's legend's stops is lower value and last row contains max value

    // First portion (${stop.color}) is the actual color of the gradient 
    // Second portion (${(stop.value / maxValue) * 100}%) is what point the gradient should be in %
    // We need to give comma separated string the the css so include comma in below map 
    // iteration using join command
    const gradientStops = data.stops.map(stop => `${stop.color} ${(stop.value / maxValue) * 100}%`).join(', ')

    return (
        // Show the legend at the top right corner of the map with z-1000 index and widht of 48
        <div className="absolute top-4 right-4 z-1000 w-48 xs:w-96 rounded-xl 
            shadow-lg p-4 bg-background/50 border border-accent/70 flex flex-col gap-3">
            <h3 className="text-sm text-foreground font-semibold">{data.title}</h3>
            { // Below one is for gradient using div with the background of gradients
            // Gradient from let to right using the calculated gradientStops
            } 
            <div className="w-full h-6 rounded-xl border border-accent/70"
                style={{
                background: `linear-gradient(to right, ${gradientStops})`
            }}/>
            <div className="flex justify-between text-xl text-foreground ">
                <span>{minValue} {data.unit}</span>
                <span>{maxValue} {data.unit}</span>
            </div>
        </div>    
    )
    }
}

type ColorStop = {
  value: number;
  color: string;
};

// Below record has key string for map type followed by 
//  3 attributes, title, unit and stops (for gradients)
const mapTypeData: Record<
    // For key (map type)
    string,
  { title: string; unit: string; stops: ColorStop[] }
> = {
  precipitation_new: {
    // To display this tile for each legend
    title: "Rain (mm)",
    unit: "mm",
    // Below stops are to specify how we are going to generate the gradients
    stops: [
      { value: 0, color: "rgba(225, 200, 100, 0)" },
      { value: 0.1, color: "rgba(200, 150, 150, 0)" },
      { value: 0.2, color: "rgba(150, 150, 170, 0)" },
      { value: 0.5, color: "rgba(120, 120, 190, 0)" },
      { value: 1, color: "rgba(110, 110, 205, 0.3)" },
      { value: 10, color: "rgba(80, 80, 225, 0.7)" },
      { value: 140, color: "rgba(20, 20, 255, 0.9)" },
    ],
  },

  snow: {
    title: "Snow (mm)",
    unit: "mm",
    stops: [
      { value: 0, color: "transparent" },
      { value: 5, color: "#00d8ff" },
      { value: 10, color: "#00b6ff" },
      { value: 25.076, color: "#9549ff" },
    ],
  },

  clouds_new: {
    title: "Cloudiness (%)",
    unit: "%",
    stops: [
      { value: 0, color: "rgba(255,255,255,0.0)" },
      { value: 10, color: "rgba(253,253,255,0.1)" },
      { value: 20, color: "rgba(252,251,255,0.2)" },
      { value: 30, color: "rgba(250,250,255,0.3)" },
      { value: 40, color: "rgba(249,248,255,0.4)" },
      { value: 50, color: "rgba(247,247,255,0.5)" },
      { value: 60, color: "rgba(246,245,255,0.75)" },
      { value: 70, color: "rgba(244,244,255,1)" },
      { value: 80, color: "rgba(243,242,255,1)" },
      { value: 90, color: "rgba(242,241,255,1)" },
      { value: 100, color: "rgba(240,240,255,1)" },
    ],
  },

  temp_new: {
    title: "Temperature (°C)",
    unit: "°C",
    stops: [
      { value: -65, color: "rgba(130,22,146,1)" },
      { value: -55, color: "rgba(130,22,146,1)" },
      { value: -45, color: "rgba(130,22,146,1)" },
      { value: -40, color: "rgba(130,22,146,1)" },
      { value: -30, color: "rgba(130,87,219,1)" },
      { value: -20, color: "rgba(32,140,236,1)" },
      { value: -10, color: "rgba(32,196,232,1)" },
      { value: 0, color: "rgba(35,221,221,1)" },
      { value: 10, color: "rgba(194,255,40,1)" },
      { value: 20, color: "rgba(255,240,40,1)" },
      { value: 25, color: "rgba(255,194,40,1)" },
      { value: 30, color: "rgba(252,128,20,1)" },
    ],
  },

  pressure_new: {
    title: "Pressure (Pa)",
    unit: "Pa",
    stops: [
      { value: 94000, color: "rgba(0,115,255,1)" },
      { value: 96000, color: "rgba(0,170,255,1)" },
      { value: 98000, color: "rgba(75,208,214,1)" },
      { value: 100000, color: "rgba(141,231,199,1)" },
      { value: 101000, color: "rgba(176,247,32,1)" },
      { value: 102000, color: "rgba(240,184,0,1)" },
      { value: 104000, color: "rgba(251,85,21,1)" },
      { value: 106000, color: "rgba(243,54,59,1)" },
      { value: 108000, color: "rgba(198,0,0,1)" },
    ],
  },

  wind_new: {
    title: "Wind (m/s)",
    unit: "m/s",
    stops: [
      { value: 1, color: "rgba(255,255,255,0)" },
      { value: 5, color: "rgba(238,206,206,0.4)" },
      { value: 15, color: "rgba(179,100,188,0.7)" },
      { value: 25, color: "rgba(63,33,59,0.8)" },
      { value: 50, color: "rgba(116,76,172,0.9)" },
      { value: 100, color: "rgba(70,0,175,1)" },
      { value: 200, color: "rgba(13,17,38,1)" },
    ],
  },
};
