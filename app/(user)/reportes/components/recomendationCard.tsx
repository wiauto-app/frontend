import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const RecomendationCard = () => {
  return (
    <div className="w-full max-w-sm">
      <Card className='bg-[#EBF2FF] border border-[#015EEB5E] text-start rounded-none'>
        <CardHeader>
          <CardTitle className='text-blue-500 font-bold'>RECOMENDACIÓN</CardTitle>
        </CardHeader>
        <CardContent>
        <p className='font-bold mb-2  text-md'>Tu Toyota Yaris convertiría +35% más con boost</p>
        <p className='text-sm'>Ya tiene buen CTR. Un boost de 7 días lo pondría arriba en su categoría.</p>
        </CardContent>
        <CardFooter className="">
          <Button type="button" >
            Activar integración
          </Button>                 </CardFooter>
      </Card>
    </div>
  )
}
