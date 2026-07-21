"use client";
import {
  HiChat,
  HiHeart,
  HiHome,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineUser,
  HiPlus,
  HiSearch,
  HiUser,
} from "react-icons/hi";
import { MobileNavbarItem } from "./mobileNavbarItem";
import { useUser } from "@/app/contexts/auth/useUser";
import { cn } from "@/lib/utils";

interface MobileNavbarItem {
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  href: string;
}

export const MobileNavbar = () => {
  const size = 22;
  const { user } = useUser();
  const authenticatedItems = [
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
      href: "/favoritos",
    },
    {
      label: "Chat",
      icon: <HiOutlineChat size={size} />,
      activeIcon: <HiChat size={size} />,
      href: "/mensajes",
    },
    {
      label: "Vender",
      icon: <HiOutlinePlus size={size} />,
      activeIcon: <HiPlus size={size} />,
      href: "/perfil",
    },
  ] as MobileNavbarItem[];

  const unauthenticatedItems = [
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
  ] as MobileNavbarItem[];

  return (
    <div className=" md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white px-2 py-4 border-t border-muted-foreground/50">
      <div
        className={cn(
          "grid   ",
          user ? "grid-cols-5" : "grid-cols-3",
        )}
      >
        {user
          ? authenticatedItems.map((item) => (
              <MobileNavbarItem key={item.href} item={item} />
            ))
          : unauthenticatedItems.map((item) => (
              <MobileNavbarItem key={item.href} item={item} />
            ))}
      </div>
    </div>
  );
};
