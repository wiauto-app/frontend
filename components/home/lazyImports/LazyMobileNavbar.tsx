"use client";
import dynamic from "next/dynamic";

export const MobileNavbar = dynamic(
  () => import("@/components/mobileNavbar/mobileNavbar").then(
    (mod) => mod.MobileNavbar,
  ),
  {
    ssr: false,
  },
);
export const LazyMobileNavbar = () => {
  return <MobileNavbar />;
}
