"use client";

import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/app/contexts/auth/authContext";
import { 
  LayoutGrid, 
  Car, 
  Heart, 
  Search, 
  MessageSquare, 
  Bell, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Edit
} from "lucide-react";

export function UserSidebar() {
  const authContext = useContext(AuthContext);
  const pathname = usePathname();

  const user = authContext?.user;

  const links = [
    { href: "/inicio", label: "Inicio", icon: LayoutGrid },
    { href: "/mis-anuncios", label: "Mis anuncios", icon: Car },
    { href: "/favoritos", label: "Favoritos", icon: Heart },
    { href: "/busquedas-guardadas", label: "Búsquedas guardadas", icon: Search },
    { href: "/mensajes", label: "Mensajes (chat)", icon: MessageSquare },
    { href: "/notificaciones", label: "Notificaciones", icon: Bell },
    { href: "/perfil", label: "Mi perfil", icon: UserIcon },
    { href: "/configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="w-full md:w-64 flex flex-col gap-4">
      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name || "Usuario"}</h3>
            <p className="text-sm text-gray-500">#{user?.id || "---"}</p>
          </div>
        </div>
        <Link href="/perfil" className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
          <Edit className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <nav className="flex flex-col space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-2 border-t border-gray-100">
            <button 
              onClick={() => authContext?.logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
