import Providers from "../providers";
import { UserSidebar } from "./components/UserSidebar";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
