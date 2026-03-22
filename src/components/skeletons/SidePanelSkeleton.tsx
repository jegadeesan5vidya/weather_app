import { Skeleton } from '../ui/skeleton'
import SideCardSkeleton from './SideCardSkeleton'

type Props = {}

export default function SidePanelSkeleton({}: Props) {
  return (
    <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Air Pollution</h1>
            <div className="flex items-center gap-2">
                { // If both width and hight are of same size, then we can use size as below
                  // Instead of this <Skeleton className="w-12 h-12"/>, replace it with below
                  // <Skeleton className="size-12"/>  
                }
                <Skeleton className="size-12"/>    
            </div>
             { 
                Array.from({length: 8}).map((_, index) => (
                    <SideCardSkeleton key={index}/>
                ))
             }
        </div>
  )
}