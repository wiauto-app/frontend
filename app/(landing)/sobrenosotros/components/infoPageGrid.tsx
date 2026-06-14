'use client'
import React from 'react'
import { Card ,CardContent, CardHeader} from '@/components/ui/card';
import { Label } from '@/components/ui/label';


interface infoCard {
  name:string,
  description:string;
  itsBgBlue:boolean;
} 



export const InfoPageGrid = ({info}: {info: infoCard[]}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-none mx-auto pt-5'>        
    {
      info.map((inf, idx)=>(
        <Card key={idx} className={inf.itsBgBlue?'bg-blue-700 px-2 shadow-lg allign-center justify-center':'bg-white p-4 shadow-lg allign-center justify-center'}>
          <CardContent>
            <Label className={inf.itsBgBlue?'text-white text-2xl font-bold mb-2':'text-black text-2xl font-bold mb-2'}>{inf.name}</Label>
            <p className={inf.itsBgBlue?'text-white text-md':'text-black text-md'}>{inf.description}</p>
          </CardContent>
        </Card>
      ))
    }
    </div>
  )
}

