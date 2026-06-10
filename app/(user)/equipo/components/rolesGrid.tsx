import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@base-ui/react'
import { Check, ShieldHalf } from 'lucide-react'
import React from 'react'

const rolesGrid = ({roles}:any) => {
  return (
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Roles y permisos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role:any) => (
                   <Card key={role.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-blue-100">
            <CardContent className="px-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <ShieldHalf className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                  </div>
                </div>
               <div className="items-center">
                 <p className="text-sm text-gray-500">{role.numberOfMembers} Miembros</p>
               </div>
              </div>

              <div className="space-y-2 mb-6">
             
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission:string, idx:number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-sm text-gray-700"
                    >
                      <Check className="w-3 h-3 text-green-600" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>    
                <Button type="button"  className="mt-4 inline-block text-sm text-blue-600">
         Editar permisos →
        </Button>
            </CardContent>
          </Card>
                ))}
              </div>
            </div>
  )
}

export default rolesGrid;
