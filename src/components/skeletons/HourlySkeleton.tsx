import WeatherIcon from '../WeatherIcon'
import Card from '../cards/Card'
import { Skeleton } from '../ui/skeleton'

type Props = {}

export default function HourlySkeleton({}: Props) {
  return (
    <Card title="Hourly Forecast(48 hours)" childrenClassName="flex gap-6 2xl:justify-between overflow-x-scroll">
        {
            Array.from({length: 48}).map((_,index) => (
                <div key={index} className="flex flex-col gap-2 items-center p-2">
                    <Skeleton className="w-15 h-6 2xl:scale-110"/>
                    <Skeleton className="size-8 2xl:size-10 rounded-full"/>
                    <Skeleton className="w-8 h-6 2xl:scale-110"/>
                </div>
            ))
        }
    </Card>
  )
}