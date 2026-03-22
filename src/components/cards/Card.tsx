import clsx from 'clsx'
import React, { type ReactNode } from 'react'

type Props = {
    children: ReactNode,
    title?: string, // Title is optional 
    // Add optional childrenClassName property (by using ? symbol)
    childrenClassName?: string,
    // Add optional className property
    className?: string,
}

export default function Card({children, title, className, childrenClassName}: Props) {

    /** Old div style
      * <div className="p-4 mt-2 rounded-xl bg-linear-to-br from-card to-card border-blue-500 border-2 flex flex-col gap-4">
      */
  return (

    <div className={clsx("p-4 rounded-xl bg-linear-to-br from-card to-card/60 shadow-md flex flex-col gap-4 2xl:h-full border dark:border-none", className)}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {/** Here adding animation fade-in which defined in index.css file
         * using clsx and use _ as space cannot be used in the CSS
          */}
        <div className={clsx(childrenClassName, 'animate-[fade-in_1s_ease-out_forwards] 2xl:flex-1')}>{children}</div>
    </div>
  )
}

