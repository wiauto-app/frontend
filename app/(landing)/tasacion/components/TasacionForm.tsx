'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const marcas = [
  'Audi','BMW','Chevrolet','Citroën','Ford','Honda',
  'Hyundai','Kia','Mazda','Mercedes-Benz','Nissan',
  'Peugeot','Renault','Seat','Toyota','Volkswagen',
]
const modelos: Record<string, string[]> = {
  Audi:          ['A1','A3','A4','A6','Q3','Q5','Q7'],
  BMW:           ['Serie 1','Serie 3','Serie 5','X1','X3','X5'],
  Chevrolet:     ['Aveo','Captiva','Cruze','Spark','Trax'],
  Citroën:       ['C3','C4','C5 Aircross','Berlingo'],
  Ford:          ['EcoSport','Edge','Escape','Explorer','Fiesta','Focus','Mustang'],
  Honda:         ['Accord','Civic','CR-V','HR-V','Pilot'],
  Hyundai:       ['Accent','Elantra','Santa Fe','Sonata','Tucson'],
  Kia:           ['Carnival','Cerato','Rio','Sorento','Sportage'],
  Mazda:         ['CX-3','CX-5','CX-9','Mazda2','Mazda3','Mazda6'],
  'Mercedes-Benz':['Clase A','Clase C','Clase E','GLA','GLC','GLE'],
  Nissan:        ['Frontier','Kicks','Leaf','Murano','Note','Sentra','Versa','X-Trail'],
  Peugeot:       ['2008','208','3008','308','5008','508'],
  Renault:       ['Captur','Clio','Duster','Koleos','Logan','Megane','Sandero'],
  Seat:          ['Arona','Ateca','Ibiza','Leon','Tarraco'],
  Toyota:        ['Camry','Corolla','Fortuner','Hilux','Land Cruiser','RAV4','Yaris'],
  Volkswagen:    ['Amarok','Golf','Jetta','Passat','Polo','T-Cross','Tiguan'],
}
const carrocerias  = ['Berlina','Cabrio','Coupé','Familiar','Monovolumen','Off-road','Pickup','SUV']
const combustibles = ['Diésel','Eléctrico','Gasolina','Híbrido','Híbrido enchufable','GLP']
const años         = Array.from({ length: 25 }, (_, i) => String(2025 - i))
const versiones: Record<string, string[]> = {
  Audi:    ['1.0 TFSI 95 CV','1.4 TFSI 125 CV','2.0 TDI 150 CV','S line'],
  BMW:     ['116i','318i','320d','xDrive20d','M Sport'],
  default: ['1.0 i','1.2 TSI','1.4 TDI','1.6 HDI','2.0 TDI','2.0 GTI'],
}

const TasacionSchema = z.object({
  marca: z.string().min(1, "Por favor selecciona una marca."),
  modelo: z.string().min(1, "Por favor selecciona un modelo."),
  carroceria: z.string().min(1, "Por favor selecciona una carrocería."),
  combustible: z.string().min(1, "Por favor selecciona un tipo de combustible."),
  year: z.string().min(1, "Por favor selecciona un año."),
  version: z.string().min(1, "Por favor selecciona una versión."),
  caja: z.string().min(1, "Por favor selecciona un tipo de caja."),
  km: z.string().min(1, "Por favor ingresa los kilómetros."),
  cp: z.string().min(1, "Por favor ingresa tu código postal."),
})

type TasacionDto = z.infer<typeof TasacionSchema>

export default function TasacionForm() {
  const form = useForm<TasacionDto>({
    resolver: zodResolver(TasacionSchema),
    defaultValues: {
      marca: "",
      modelo: "",
      carroceria: "",
      combustible: "",
      year: "",
      version: "",
      caja: "",
      km: "",
      cp: "",
    },
  })

  const marcaValue = form.watch("marca")
  const availableModelos = marcaValue ? (modelos[marcaValue] ?? []) : []
  const availableVersiones = marcaValue ? (versiones[marcaValue] ?? versiones.default) : versiones.default

  function onSubmit(data: TasacionDto) {
    console.log(data)
  }

  return (
    <Card className="w-full border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.09)]">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="px-6 py-6">
          <FieldGroup className="flex flex-col gap-4">
            <Controller
              name="marca"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-marca">Marca</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={v => { field.onChange(v); form.setValue("modelo", ""); form.setValue("version", "") }}
                  >
                    <SelectTrigger ref={field.ref} id="sel-marca">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="modelo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-modelo">Modelo</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!marcaValue}
                  >
                    <SelectTrigger ref={field.ref} id="sel-modelo">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModelos.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="carroceria"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-carroceria">Carrocería</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger ref={field.ref} id="sel-carroceria">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {carrocerias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="combustible"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-combustible">Combustible</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger ref={field.ref} id="sel-combustible">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {combustibles.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-year">Año de matrícula</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger ref={field.ref} id="sel-year">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {años.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="version"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-version">Versión</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger ref={field.ref} id="sel-version">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVersiones.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="caja"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-caja">Tipo de caja</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger ref={field.ref} id="sel-caja">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatica">Automática</SelectItem>
                      <SelectItem value="dsg">DSG / CVT</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="km"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="input-km">Kilómetros del vehículo</FieldLabel>
                  <Input
                    ref={field.ref}
                    id="input-km"
                    type="number"
                    placeholder="Ingresa"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="cp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="input-cp">Código postal</FieldLabel>
                  <Input
                    ref={field.ref}
                    id="input-cp"
                    placeholder="Ingresa"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <Button type="submit" className="w-full bg-[#1746C8] hover:bg-blue-800">
            Obtener tasación
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
