import { authService } from "@/services/authService";
import Providers from "../providers";
import { UserSidebar } from "./components/UserSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = (await cookies()).get("access_token")?.value;
  const user = await authService.getMe(accessToken);

  if (!user.ok) {
    redirect("/iniciar-sesion");
  }
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-80 shrink-0">
              <UserSidebar />
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </Providers>
  );
}
