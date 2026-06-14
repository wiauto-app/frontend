'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, BarChart, Bar } from "recharts"
import { ArrowUp, TrendingUp } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"


interface Report {
  id: number;
  name: string;
  number:number;
  percentage:number; 
  chartData?:{ month: string; year?: number; desktop: number; mobile?: number }[];
} 

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const chartConfig2 = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig



export const ReportesMesGrid = ({reports}: {reports: Report[]}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'> 
      <Card>
      <CardHeader>
        <div className='flex justify-between items-center'> 
          <div>
            <CardTitle>Total de servicios realizados</CardTitle>
            <CardDescription>$ 16345</CardDescription>
          </div>
          <div>
            <CardTitle className='text-green-500 flex flex-row items-center gap-2'>13% <ArrowUp className="h-4 w-4" /></CardTitle>
            <CardDescription>VS mes anterior</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={reports[0].chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>  
    </Card>
     <Card>
      <CardHeader>
        <div className='flex justify-between items-center'> 
          <div>
            <CardTitle>Lorem ipsum dolor sit amet</CardTitle>
            <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
          </div>
          <div>
            <CardTitle className='text-green-500 flex flex-row items-center gap-2'>Lorem</CardTitle>
            <CardDescription>Lorem</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig2}>
          <BarChart data={reports[1].chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  )
}

