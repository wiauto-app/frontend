"use client";

import {
  HiChat,
  HiHeart,
  HiHome,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineUser,
  HiSearch,
  HiUser,
} from "react-icons/hi";

import { useUser } from "@/app/contexts/auth/useUser";
import { cn } from "@/lib/utils";

import {
  MobileNavbarItem,
  type MobileNavbarItemData,
} from "./mobileNavbarItem";

export const MobileNavbar = () => {
  const size = 20;
  const { user } = useUser();

  const authenticatedItems: MobileNavbarItemData[] = [
    {
      label: "Inicio",
      icon: <HiOutlineHome size={size} />,
      activeIcon: <HiHome size={size} />,
      href: "/",
    },
    {
      label: "Buscar",
      icon: <HiOutlineSearch size={size} />,
      activeIcon: <HiSearch size={size} />,
      href: "/vehiculos",
    },
    {
      label: "Mis listas",
      icon: <HiOutlineHeart size={size} />,
      activeIcon: <HiHeart size={size} />,
      href: "/usuario/favoritos",
    },
    {
      label: "Chat",
      icon: <HiOutlineChat size={size} />,
      activeIcon: <HiChat size={size} />,
      href: "/usuario/mensajes",
    },
    {
      label: "Perfil",
      icon: <HiOutlineUser size={size} />,
      activeIcon: <HiUser size={size} />,
      href: "/usuario/inicio",
    },
  ];

  const unauthenticatedItems: MobileNavbarItemData[] = [
    {
      label: "Inicio",
      icon: <HiOutlineHome size={size} />,
      activeIcon: <HiHome size={size} />,
      href: "/",
    },
    {
      label: "Buscar",
      icon: <HiOutlineSearch size={size} />,
      activeIcon: <HiSearch size={size} />,
      href: "/vehiculos",
    },
    {
      label: "Iniciar sesión",
      icon: <HiOutlineUser size={size} />,
      activeIcon: <HiUser size={size} />,
      href: "/iniciar-sesion",
    },
  ];

  return (
    <div>
      <nav
        aria-label="Navegación móvil"
        className="fixed right-2 bottom-2 left-2 z-50 rounded-3xl bg-white/80 px-2 py-3 shadow-md backdrop-blur-sm md:hidden "
      >
        <div className={cn("grid gap-1", user ? "grid-cols-5" : "grid-cols-3")}>
          {user
            ? authenticatedItems.map((item) => (
                <MobileNavbarItem key={item.href} item={item} />
              ))
            : unauthenticatedItems.map((item) => (
                <MobileNavbarItem key={item.href} item={item} />
              ))}
        </div>
      </nav>
    </div>
  );
};
