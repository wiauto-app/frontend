'use client'
import React from 'react'
import { Card ,CardContent, CardHeader} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CartesianGrid, Line, LineChart } from "recharts"
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
  chartData?:{ month: string; desktop: number }[];
} 

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig



export const ReportesGrid = ({reports}: {reports: Report[]}) => {
  return (
    <div className='grid grid-cols-1  lg:grid-cols-4 gap-4'>        {reports.map((report) => (
           <Card
           key={report.id}
           className="flex flex-col bg-white gap-0 py-2"
           >
            <CardHeader>

                <h2 className="text-md font-medium text-gray-300 self-start">Mensual</h2>
                <Label className='text-center font-bold text-lg'>{report.name}</Label>
              
            </CardHeader>
                <CardContent className=' mb-0'>
                <div className='flex flex-row justify-between w-full max-w-8/10'>
                    <div className='flex flex-col max-w-1/2'>
                        <Label className='text-xl font-bold'>{report.number}</Label>
                        {report.percentage>0?(
                            <span className='text-green-500 flex items-center gap-2'>
                                +{report.percentage}%
                            </span>
                        ):(
                            <span className='text-red-500 flex items-center gap-2'>
                                {report.percentage}%
                            </span>
                        )}
                    </div>
                    <div className="w-32 h-16 max-w-1/2">
            <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            data={report.chartData || chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>

                    </div>
                </div>                   
         
            
        </CardContent>

           </Card>
        ))}
    </div>
  )
}

