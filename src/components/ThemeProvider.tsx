import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Props = {
    children: ReactNode
}
// Define type Theme for light and dark
type Theme = 'light' | 'dark'

// Create a Theme Context type (user defined), which will have above team and a function 
// to toggle (light/dark) with returns void
type ThemeContextType = {
    theme: Theme,
    toggleTheme: () => void,
}

// Create ThemeContext const variable using React's createContext
// This is the way to create any context outside a component
const ThemeContext = createContext<ThemeContextType|undefined>(undefined)

export default function ThemeProvider({children}: Props) {
    const [theme, setTheme]=useState<Theme>('dark')  // Default theme set to dark mode

    // Define the toggleTheme function
    const toggleTheme = () => {
        // Toggle the previous value 
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }
    // Use Effect hook to monitor/look for changes to the theme (light or dark)
    useEffect(()=> {
        // Here get the root element of the document and change body's class to either 
        // dark or light based on the current theme value
        // i.e., we access to this body in index,html <body class="dark">, initially we hardcoded class='dark'
        // Now we add or remove the class="dark" dynamically to change according to the theme Switcher
        // Note: How this light/dark mode is working, how each component color is changed based on the dark or light mode?
        // The answer is refer index.css, when we setup Shad CN, we choose color pallete as zinc, 
        // what zinc does is, it defines tons of CSS variables in index.css that has color list for background, foreground, 
        // card,s inputs etc.  We also have dark selector .dark {...} which is a class selector, and for any element 
        // that has dark on it, this will set all the css variables defined here.  All these css variable also 
        // defind in .root{...} selector as default with light mode color settings.  Refer to value for --card variable in both selector 
        // That's how dark and light mode is working
        const root = document.documentElement 
        if(theme === 'dark')
        {
            // Add class dark, to turn it into dark mode 
            root.classList.add('dark')
        }
        else {
            // Remove the class, to turn it into light mode
            root.classList.remove('dark')
        }
    },[theme])
  return (
    // Wrap the JSX with this ThemeContext provider wrap, need to pass value object to the provider 
    // which is the theme and toggleTheme function  (both should be passed as object array)
    
    <ThemeContext.Provider value={{theme, toggleTheme}}> 
        { // Add children (using the props) here, this children always should be of ReactNode type
         // ***** The Theme Provider going to wrap the children which means the entire App itself 
         // So entire app is going to have context whether we are on dark or light mode  
         // With ths, next step is go to main.tsx which is the entry point for our app.  
         // In here wrap the App component with the ThemeProvider
        } 
        {children}
    </ThemeContext.Provider>
  )
}

// Export useTheme() hook to comsume the value of light/dark mode outside
// This is a pattern to make use of the context really safe and expose them in a convenient hook
// In any component that wants to use this useTheme hook, we dont have to call useContext, 
// instead call this hook which already create it and return.  
// In summary, wherever useTheme is called, it returns the theme with the toggle mode   
// Refer to LightDarToggle.tsx for how to use useTheme hook   
export const useTheme = () => {
    // Here create React's useContext using Theme Context
    const context = useContext(ThemeContext)
    // Through error if the context is not defined or exists
    if(!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context;
}
