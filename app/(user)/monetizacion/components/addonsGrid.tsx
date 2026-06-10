import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@base-ui/react'
import { ShieldHalf } from 'lucide-react'

interface Addon {
  id: number;
  name: string;
  description: string;
  price?: string;
  features?: string[];
  enabled?: boolean;
}

interface AddonsGridProps {
  addons: Addon[];
}
const addonsGrid = ({addons}:AddonsGridProps) => {
  return (
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Add-ons & boosters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {addons.map((addon:Addon) => (
                   <Card key={addon.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-blue-100">
            <CardContent className="px-6 space-y-2">
              <div className="flex items-start justify-between ">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <ShieldHalf className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{addon.name}</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
             
                <div className="flex flex-wrap gap-2">
                 {addon.description}
                </div>
              </div>    
               <Button type="button"  className="mt-4 inline-block text-sm text-blue-600">
         Activar →
        </Button>
            </CardContent>
          </Card>
                ))}
              </div>
            </div>
  )
}

export default addonsGrid;
