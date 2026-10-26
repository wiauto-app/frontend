import { NavbarLayout } from "@/components/layout/navbarLayout";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <NavbarLayout>
      {children}
    </NavbarLayout>
  );
}