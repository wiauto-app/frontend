import React from 'react'
import { BaseSelector } from './baseSelector'
import { Users } from 'lucide-react'

const options = [
  { label: "Familias", value: "family" },
  { label: "Jóvenes", value: "young" },
  { label: "Primer vehículo", value: "first-car" },
  { label: "Empresarios", value: "business" },
  { label: "Conductores de Uber", value: "uber" },
  { label: "Aventureros", value: "adventurer" },
  { label: "Personas que buscan ahorrar combustible", value: "fuel-saver" },
  { label: "Coleccionistas", value: "collector" },
  { label: "Deportistas", value: "athlete" },
  { label: "Cualquiera", value: "anyone" },
]

export const ObjectiveSelector = ({ value, onChange }: { value: string, onChange: (value: string | null) => void }) => {
  return (
    <BaseSelector Icon={Users} type="radio" value={value} onChange={onChange} options={options} placeholder="Selecciona un objetivo" />
  )
}
