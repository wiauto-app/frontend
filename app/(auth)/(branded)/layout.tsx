import { AuthSplitLayout } from "@/app/(auth)/components/AuthSplitLayout";
import { getAutenticacionCompartido } from "@/app/(auth)/services/autenticacionService";

interface BrandedAuthLayoutProps {
  children: React.ReactNode;
}

export default async function BrandedAuthLayout({
  children,
}: BrandedAuthLayoutProps) {
  const compartido = await getAutenticacionCompartido();

  return (
    <AuthSplitLayout panelTitulo={compartido.panel_titulo}>
      {children}
    </AuthSplitLayout>
  );
}
