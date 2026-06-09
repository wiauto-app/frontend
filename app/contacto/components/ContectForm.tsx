"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ContactSchema, ContactDto } from "@/validations/Schemas";
import { contactService } from "@/services/authService";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";

export default function ContectForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ContactDto>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      userType: "",
      interestedIn: "",
      city: "",
      address: "",
      message: "",      
    },
  })



  async function onSubmit(data:   ContactDto) {
    setIsLoading(true);
    try {
      const response = await contactService.contact(data);
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al enviar el mensaje");
      }
      toast.success(response.data?.message || "Mensaje enviado exitosamente");
      form.reset();
    } catch (error: any) {
      const genericMessage = "Error al enviar el mensaje. Por favor, intenta de nuevo.";
      if (error.message?.includes("No se encontró") || error.message?.includes("incorrectos")) {
        toast.error(genericMessage);
      } else {
        toast.error(error.message || genericMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-7xl border-0 shadow-none md:my-20 my-6 mx-auto ring-0">
      <CardHeader>
        <h1 className="text-sm text-[#015EEB] font-bold text-center">Estamos listos para ser tu aliado</h1>
        <CardTitle className="text-2xl font-bold text-center">Contactanos</CardTitle>
        <CardDescription className="text-center text-sm md:my-10 my-6 font-semibold">
 Déjanos tus datos y un asesor se contactará contigo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Nombres
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nombres"
                    autoComplete="name"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastname">
                    Apellidos
                  </FieldLabel>
                  <Input
                    {...field}
                    id="lastname"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Apellidos"
                    autoComplete="lastname"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Correo electronico"
                    autoComplete="email"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>

              )}
            />
             <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">
                    Teléfono
                  </FieldLabel>
                  <Input
                    {...field}
                    id="phone"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Teléfono"
                    autoComplete="phone"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
                
              )}
            />
             <Controller
              name="userType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="userType">
                    Tipo de usuario
                  </FieldLabel>
               <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger ref={field.ref}>
                  <SelectValue placeholder="Tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agencia">Agencia</SelectItem>
                  <SelectItem value="concesionario">Concesionario</SelectItem>
                  <SelectItem value="flota">Flota</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
               </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="interestedIn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="interestedIn">
                    Interes especifico
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue placeholder="Interes especifico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="posventa">Posventa</SelectItem>
                      <SelectItem value="creditos">Creditos</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="city">
                    Ciudad
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bogota">Bogotá</SelectItem>
                      <SelectItem value="medellin">Medellín</SelectItem>
                      <SelectItem value="cali">Cali</SelectItem>
                      <SelectItem value="barranquilla">Barranquilla</SelectItem>
                      <SelectItem value="bucaramanga">Bucaramanga</SelectItem>
                      <SelectItem value="cartagena">Cartagena</SelectItem>
                      <SelectItem value="cucuta">Cúcuta</SelectItem>
                      <SelectItem value="pereira">Pereira</SelectItem>
                      <SelectItem value="manizales">Manizales</SelectItem>
                      <SelectItem value="ibague">Ibagué</SelectItem>
                      <SelectItem value="armenia">Armenia</SelectItem>
                      <SelectItem value="neiva">Neiva</SelectItem>
                      <SelectItem value="popayan">Popayán</SelectItem>
                      <SelectItem value="tunja">Tunja</SelectItem>
                      <SelectItem value="monteria">Montería</SelectItem>
                      <SelectItem value="sincelejo">Sincelejo</SelectItem>
                      <SelectItem value="villavicencio">Villavicencio</SelectItem>
                      <SelectItem value="florencia">Florencia</SelectItem>
                      <SelectItem value="mitu">Mitu</SelectItem>
                      <SelectItem value="san_jose_del_guaviare">San José del Guaviare</SelectItem>
                      <SelectItem value="guapi">Guapi</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">
                    Dirección
                  </FieldLabel>
                  <Input
                    {...field}
                    id="address"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Dirección"
                    autoComplete="address"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
        
          </FieldGroup>
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="message">
                    Mensaje
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="message"
                    aria-invalid={fieldState.invalid}
                    placeholder="Mensaje"
                    autoComplete="message"
                    disabled={isLoading}
                    className="bg-background/50 min-h-[100px]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full gap-3">
     
          <Button 
            type="submit" 
            form="login-form" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Cargando...
              </span>
            ) : "Enviar"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
