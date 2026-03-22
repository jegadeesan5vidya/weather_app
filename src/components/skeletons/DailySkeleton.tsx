import React from 'react'
import Card from '../cards/Card'
import WeatherIcon from '../WeatherIcon'
import { Skeleton } from '../ui/skeleton'

type Props = {}

export default function DailySkeleton({}: Props) {
  return (
     <Card title="Daily Forecast" childrenClassName="flex flex-col gap-4 2xl:justify-between">
        {Array.from({length:8}).map((_, index) => (
          <div key={index} className="flex justify-between gap-4" >
            <Skeleton className="w-9 h-8"/>
                <Skeleton className="w-30 h-8 rounded-full"/>
                <Skeleton className="size-8"/>
                <Skeleton className="size-8"/>
                <Skeleton className="size-8"/>            
          </div>
          ))
        }
    </Card> 
  )
}