import { AuthSplitLayout } from "@/app/(auth)/components/AuthSplitLayout";

interface BrandedAuthLayoutProps {
  children: React.ReactNode;
}

export default function BrandedAuthLayout({ children }: BrandedAuthLayoutProps) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
