// To generate ts react code type tsrfc below and it will generate boiler plate code
import React, { type ReactNode } from 'react'

type Props = {
    children: ReactNode
}

// Render the children content in frontend.  
export default function Card({children}: Props) {
    console.log("Inside Card and the children is", children)
    console.log(children)
  return (
    // Highlight the whole div component and use outer wrap here by clicking control shift p and type wrap, and enter div to wrap it
    <div>
        <div className="p-4 m-4 bg-white text-black rounded shadow">
        <pre className="whitespace-pre-wrap break-all">
            {children}
        </pre>
        </div>
    </div>
  )
}