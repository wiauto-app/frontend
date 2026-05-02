"use client";

import { User, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema, UpdateProfileDto } from "@/validations/Schemas";
import { useContext, useEffect, useState, useTransition } from "react";
import { AuthContext } from "@/app/contexts/auth/authContext";
import { updateProfileAction } from "../userActions/userActions";
import { toast } from "sonner";

export default function PerfilPage() {
  const authContext = useContext(AuthContext);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileDto>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: "",
      last_name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (authContext?.user) {
      reset({
        name: authContext.user.name || "",
        last_name: authContext.user.last_name || "",
        // phone: authContext.user.phone || "",
        // address: authContext.user.address || "",
      });
    }
  }, [authContext?.user, reset]);

  const onSubmit = (data: UpdateProfileDto) => {
    startTransition(async () => {
      try {
        await updateProfileAction(data);
        toast.success("Perfil actualizado correctamente");
        authContext?.refreshUser();
      } catch (error) {
        toast.error("Ocurrió un error al actualizar el perfil");
      }
    });
  };

  if (authContext?.isLoading) {
    return <div className="p-6 text-center text-gray-500">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-500 mt-1">Administra tu información personal y datos de contacto</p>
        </div>
        <Link href="/perfil/seguridad" className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Seguridad y Contraseña
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="name" 
                  {...register("name")}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
                  placeholder="Tu nombre" 
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium text-gray-700">Apellido</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="last_name" 
                  {...register("last_name")}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-all ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`} 
                  placeholder="Tu apellido" 
                />
              </div>
              {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  disabled 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md sm:text-sm cursor-not-allowed" 
                  value={authContext?.user?.email || "Cargando..."} 
                />
              </div>
              <p className="text-xs text-gray-500">El correo electrónico no se puede cambiar.</p>
            </div>

            {/* <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  id="phone" 
                  {...register("phone")}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} 
                  placeholder="+34 600 000 000" 
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div> */}

            {/* <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="address" 
                  {...register("address")}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-all ${errors.address ? 'border-red-500' : 'border-gray-300'}`} 
                  placeholder="Av. Principal 123" 
                />
              </div>
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div> */}
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-100 mt-6">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
