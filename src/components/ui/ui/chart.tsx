import * as React from "react"
import {
  Area,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaProps,
  BarProps,
  LineProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
  CartesianGridProps,
  LegendProps,
  ComposedChart
} from "recharts"

import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: Array<Record<string, any>>
}

function Chart({ data, className, children, ...props }: ChartProps) {
  return (
    <div className={cn("h-full w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          {children}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function ChartArea({ className, ...props }: AreaProps) {
  return <Area className={cn("fill-primary/20 stroke-primary", className)} {...props} />
}

function ChartBar({ className, ...props }: BarProps) {
  return <Bar className={cn("fill-primary", className)} {...props} />
}

function ChartLine({ className, ...props }: LineProps) {
  return <Line className={cn("stroke-primary", className)} {...props} />
}

function ChartLegend({ className, ...props }: LegendProps) {
  return <Legend className={cn("", className)} {...props} />
}

function ChartTooltip(props: TooltipProps<any, any>) {
  return <Tooltip {...props} />
}

function ChartXAxis({ className, ...props }: XAxisProps) {
  return <XAxis className={cn("", className)} {...props} />
}

function ChartYAxis({ className, ...props }: YAxisProps) {
  return <YAxis className={cn("", className)} {...props} />
}

function ChartCartesianGrid({ className, ...props }: CartesianGridProps) {
  return <CartesianGrid className={cn("", className)} {...props} />
}

export {
  Chart,
  ChartArea,
  ChartBar,
  ChartLine,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
} 