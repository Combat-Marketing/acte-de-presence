import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: number
}

export function Loading({ className, size = 24 }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  )
}

export function SideMenuLoading() {
  return (
    <div className="w-12 bg-[var(--color-bg-secondary)] h-full border-r border-r-[var(--color-primary)] flex flex-col">
      <div className="py-5 px-1 flex justify-center items-center border-b border-b-gray-300">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="p-2 flex flex-col flex-1 gap-2 border-b border-b-gray-300">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
      <div className="mt-auto p-2 flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
} 