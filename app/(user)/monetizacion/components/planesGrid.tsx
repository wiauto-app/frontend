import React from 'react'
import { Check, X } from 'lucide-react'
import { Card ,CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import { Button } from '@/components/ui/button';


interface Plan {
  id: number;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  notFeatures: string[];
  buttonText: string;
  active?: boolean;
} 
const PlanesGrid = ({plans}: {plans: Plan[]}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>        {plans.map((plan) => (
           <Card
           key={plan.id}
           className="flex flex-col gap-6  bg-white p-4"
           >
            <CardHeader>

                <h2 className="text-lg font-bold text-gray-900 text-center">{plan.name}</h2>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-700 text-center">$
                        <span className="text-4xl font-bold text-blue-500">{plan.monthlyPrice}</span> / mensual</p>
                    <p className="text-gray-700 text-center text-sm">{plan.annualPrice} / año</p>
                </div>
            </CardHeader>
                <CardContent>
            <ul className="flex flex-col gap-2">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 bg-blue-500 text-white rounded-full p-1" />
                        <p>{feature}</p>
                    </li>
                ))}
                {plan.notFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <X className="w-4 h-4 bg-gray-500 text-white rounded-full p-1" />
                        <p>{feature}</p>
                    </li>
                ))}
            </ul>
            
        </CardContent>
        <CardFooter>
            <Button variant="default" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
                {plan.active? "Plan actual":"Cambiar plan"}</Button>
        </CardFooter>
           </Card>
        ))}
    </div>
  )
}

export default PlanesGrid;

