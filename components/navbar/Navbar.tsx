import { NavbarActions } from "./components/NavbarActions";
import { NavbarBrand } from "./components/NavbarBrand";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <NavbarBrand />

        {/* Slot para futuros enlaces de navegación */}
        <div className="hidden flex-1 items-center justify-center gap-1 md:flex" />

        <NavbarActions />
      </nav>
    </header>
  );
};
