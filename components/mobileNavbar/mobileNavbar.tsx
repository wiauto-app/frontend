import {
  HiChat,
  HiHeart,
  HiHome,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlinePlus,
  HiOutlineSearch,
  HiPlus,
  HiSearch,
} from "react-icons/hi";
import { MobileNavbarItem } from "./mobileNavbarItem";

export const MobileNavbar = () => {
  const size= 22;

  const items = [
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
  ];

  return (
    <div className=" md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white px-2 py-4 border-t border-muted-foreground/50">
      <div className="grid grid-cols-5  ">
        {items.map((item) => (
          <MobileNavbarItem key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
};
