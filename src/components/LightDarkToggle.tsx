import React from 'react'
import { Switch } from './ui/switch'
import Sun from "/src/assets/sun.svg?react"
import Moon from "/src/assets/moon.svg?react"
import { useTheme } from './ThemeProvider'

type Props = {}

/**  
 * Here we use sun svg and moon svg files to show light and dark switch mode
 * Download similar files from https://www.svgrepo.com/ SVG Repo
*/

export default function LightDarkToggle({}: Props) {
    // With below statement, now we have access to the theme (light/dark mode) 
    // and ability to use toggleTheme function which toggle between light and dark 
    const {theme, toggleTheme} = useTheme()
  return (
    <div className="flex items-center gap-2">
        <Sun className="size-9 "/>
        {// Below Switch component has two primary props, checked 
        // and onCheckedChange (whenever we click the switcher, we toggle the theme) events
        // i.e., whenever we click on the moon, it toggle to dark, and when clicking sun icon, toggle to light
        // Note: By default we checked the dark mode (moon)
        // Next step is go to ThemeProvider and use useEffect hook to listen to theme changes by this switcher
        }
        <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme}/>
        <Moon className="size-7 "/>
    </div>
  )
}