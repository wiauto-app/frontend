"use client";

import { useContext, useEffect, useTransition } from "react";
import { AuthContext } from "@/app/contexts/auth/authContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema, UpdateProfileDto } from "@/validations/Schemas";
import { updateProfileAction } from "../userActions/userActions";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, MessageCircle, Mail, BookOpen, AlertCircle } from "lucide-react";

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

  const user = authContext?.user;
  const fullName = user?.name ? `${user.name} ${user.last_name || ""}`.trim() : "Andrea Gutiérrez";

  return (
    <div className="space-y-6 pb-20 max-w-5xl">
      {/* Banner de Usuario Superior */}
      <div className="bg-blue-100/50 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 border border-blue-100">
        <div className="w-20 h-20 bg-blue-200 rounded-full flex-shrink-0 flex items-center justify-center text-blue-700 text-2xl font-bold overflow-hidden relative">
          {/* Avatar placeholder / initials */}
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3 h-3" /> Top vendedor
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
                <ShieldCheck className="w-3 h-3" /> Verificado
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 font-medium">
            Particular • Lima • 4.9 ★ (23 reseñas) • desde mar 2024
          </p>
        </div>
      </div>

      {/* Formulario Principal de Datos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Campos estilo input con label superpuesto (Material-like) */}
            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label htmlFor="name" className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Nombres</label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                placeholder="Andrea"
              />
            </div>

            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label htmlFor="last_name" className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Apellidos</label>
              <input
                type="text"
                id="last_name"
                {...register("last_name")}
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                placeholder="Gutierrez"
              />
            </div>

            <div className="relative border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 opacity-70">
              <label htmlFor="email" className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-xs text-gray-500">Email</label>
              <input
                type="email"
                id="email"
                disabled
                value={user?.email || "andre@hotmail.com"}
                className="block w-full border-0 p-0 text-gray-600 bg-transparent focus:ring-0 sm:text-sm outline-none cursor-not-allowed"
              />
            </div>

            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label htmlFor="phone" className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Teléfono</label>
              <input
                type="text"
                id="phone"
                {...register("phone")}
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                placeholder="+51 736433393"
              />
            </div>

            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label htmlFor="address" className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Ciudad</label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                placeholder="Madrid"
              />
            </div>

            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label htmlFor="dni" className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">DNI</label>
              <input
                type="text"
                id="dni"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                placeholder="3947584994"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-4"
          >
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Cambiar contraseña</h2>
          <form className="space-y-5">
            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Actual</label>
              <input type="password" placeholder="Ingresar" className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none" />
            </div>
            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Nueva</label>
              <input type="password" placeholder="Ingresar" className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none" />
            </div>
            <div className="relative border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Confirmar</label>
              <input type="password" placeholder="Ingresar" className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none" />
            </div>
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-2">
              Actualizar
            </button>
          </form>
        </div>

        {/* Badges de verificación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Badges de verificación</h2>
          <div className="space-y-3">
            {/* DNI No Verificado */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Identidad (DNI)</span>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors">
                Verificar
              </button>
            </div>

            {/* Email Verificado */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Email</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                Verificado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Soporte */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Soporte</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-5 hover:bg-blue-50 transition-colors cursor-pointer flex flex-col items-start">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Chat con un asesor</h3>
            <p className="text-xs text-gray-500 mt-1">Respuesta {'<'} 5 min en horario laboral</p>
          </div>

          <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-5 hover:bg-blue-50 transition-colors cursor-pointer flex flex-col items-start">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Envía un ticket</h3>
            <p className="text-xs text-gray-500 mt-1">ayuda@wiauto.es</p>
          </div>

          <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-5 hover:bg-blue-50 transition-colors cursor-pointer flex flex-col items-start">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Centro de ayuda</h3>
            <p className="text-xs text-gray-500 mt-1">Guías, FAQ y tutoriales</p>
          </div>
        </div>
      </div>
    </div>
  );
}
