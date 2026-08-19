"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { logoutAction } from "@/app/(auth)/authActions/authActions";
import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { CustomAlertDialog } from "@/components/ui/customAlertDialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accountService } from "@/services/accountService";

export const ConfiguracionContent = () => {
  const router = useRouter();
  const { logout } = useUser();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [visibilidad, setVisibilidad] = useState([
    { id: 1, label: "Mostrar badge de verificación", active: true },
    { id: 2, label: "Mostrar antigüedad de la cuenta", active: true },
    { id: 3, label: "Permitir reseñas en mi perfil", active: true },
  ]);

  const [privacidad, setPrivacidad] = useState([
    { id: 1, label: "Mostrar mi número en anuncios", active: true },
    { id: 2, label: "Permitir mensajes sin login", active: true },
    { id: 3, label: "Aparecer en perfiles públicos", active: true },
    { id: 4, label: "Compartir estadísticas con vendedores similares", active: true },
    { id: 5, label: "Compartir estadísticas con vendedores similares", active: true },
    { id: 6, label: "Compartir estadísticas con vendedores similares", active: true },
  ]);

  const toggleVisibilidad = (id: number) => {
    setVisibilidad(
      visibilidad.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  };

  const togglePrivacidad = (id: number) => {
    setPrivacidad(
      privacidad.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await accountService.deleteAccount();
      if (!response.ok) {
        toast.error(
          accountService.getResponseMessage(
            response,
            "No se pudo eliminar la cuenta",
          ),
        );
        return;
      }

      toast.success("Tu cuenta ha sido eliminada");
      try {
        await logout();
      } catch {
        // La sesión puede quedar inválida tras el borrado.
      }
      await logoutAction();
      router.replace("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cuenta",
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Visibilidad</h2>
        <div className="space-y-4">
          {visibilidad.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white"
            >
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <Button
                onClick={() => toggleVisibilidad(item.id)}
                variant="ghost"
                className={`relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent p-0 ${
                  item.active ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Privacidad</h2>
        <div className="space-y-4">
          {privacidad.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white"
            >
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <Button
                onClick={() => togglePrivacidad(item.id)}
                variant="ghost"
                className={`relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent p-0 ${
                  item.active ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 rounded-xl border border-red-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-600 mb-1">
              Zona peligrosa
            </h2>
            <p className="text-sm text-gray-600">
              Pausa o elimina tu cuenta. Esta acción es irreversible.
            </p>
          </div>
        </div>

        <CustomAlertDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              className="mt-2"
              disabled={isDeletingAccount}
            >
              Eliminar cuenta
            </Button>
          }
          title="¿Eliminar tu cuenta?"
          description="Esta acción es permanente. Perderás el acceso a tus anuncios, mensajes y configuración. Si tienes anuncios asociados, deberás eliminarlos antes."
          confirmText="Eliminar cuenta"
          cancelText="Cancelar"
          confirmVariant="destructive"
          isConfirming={isDeletingAccount}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  );
};
