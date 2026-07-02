"use client";

import { Footer, NewsletterSection } from "@/components/home";
import { usePathname } from "next/navigation";

export const ConditionalSiteFooter = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/asistente")) {
    return null;
  }

  return (
    <div className="mt-20">
      <NewsletterSection />
      <Footer />
    </div>
  );
};
