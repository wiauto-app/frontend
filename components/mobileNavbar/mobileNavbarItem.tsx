"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export const MobileNavbarItem = ({
  item,
}: {
  item: {
    href: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    label: string;
  };
}) => {
  const pathname = usePathname();

  return (
    <Link
      key={item.href}
      href={item.href}
      className="flex flex-col items-center justify-center gap-1"
    >
      {pathname === item.href ? item.activeIcon : item.icon}
      <span className="text-xs ">{item.label}</span>
    </Link>
  );
};
