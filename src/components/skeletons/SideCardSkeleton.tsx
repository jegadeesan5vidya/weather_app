import React from 'react'
import Card from '../cards/Card'
import { Skeleton } from '../ui/skeleton'

type Props = {}

export default function SideCardSkeleton({}: Props) {
  return (
    <Card
        className="hover:scale-105 transition-transition duration-300 from-sidebar-accent to-sidebar-accent/60 gap-0!" 
        childrenClassName="flex flex-col gap-3"
    >
        <div className="flex justify-between">
            <Skeleton className="w-12 h-7 dark:bg-sidebar"/>     
            <Skeleton className="w-12 h-7 dark:bg-sidebar"/>                                          
        </div>

       <Skeleton className="w-full h-1.5 dark:bg-sidebar"/>   
        <div className="flex justify-between text-xs">
            <Skeleton className="w-2 h-4 dark:bg-sidebar"/>   
            <Skeleton className="w-2 h-4 dark:bg-sidebar"/>
        </div>
        <div className="flex justify-between">
        { Array.from({length: 5}).map((_, index) => (
                <Skeleton key={index} className="w-15 h-6 dark:bg-sidebar"/>
        )) }
        </div>
    </Card>
  )
}