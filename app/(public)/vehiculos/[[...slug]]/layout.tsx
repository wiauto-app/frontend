import { HeroSearchFiltersProvider } from "@/components/home/HeroSearchFiltersContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HeroSearchFiltersProvider>
      <section>{children}</section>
    </HeroSearchFiltersProvider>
  );
}
