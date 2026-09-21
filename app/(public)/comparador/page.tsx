import type { Metadata } from "next";

import { NOINDEX_ROBOTS } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  title: "Comparador de vehículos | WiAuto",
  // Página vacía: quitar `robots` (y sumarla a INDEXABLE_STATIC_PAGES) cuando esté desarrollada.
  robots: NOINDEX_ROBOTS,
};

export default function Page() {
  return (
    <div></div>
  );
}
