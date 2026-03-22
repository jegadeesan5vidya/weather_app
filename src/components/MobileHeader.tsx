import type { Dispatch } from "react"
import Hamburger from "/src/assets/hamburger-menu.svg?react"
import LightDarkToggle from "./LightDarkToggle"

type Props = {
    setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>
}

export default function MobileHeader({setIsSidePanelOpen}: Props) {
  return (
    <div className="h-16 p-4 bg-background sticky top-0 xs:hidden gap-8 flex justify-end z-1001" >
        { // The button's className helps to hide the hamburger by default, and when screen size is 
        // md then make it appear (md:block)
        }
        <LightDarkToggle />
        <button onClick={()=> setIsSidePanelOpen(true)} 
            >
            <Hamburger className="size-6 ml-auto"/>
        </button>          
    </div>
  )
}