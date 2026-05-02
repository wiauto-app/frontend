import { AuthProvider } from "./contexts/auth/authProvider";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}