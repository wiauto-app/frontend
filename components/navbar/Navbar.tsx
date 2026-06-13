import { NavbarActions } from "./components/NavbarActions";
import { NavbarBrand } from "./components/NavbarBrand";
import { NavbarLinks } from "./components/NavbarLinks";

export const Navbar = () => {

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <nav
        aria-label="Navegación principal"
        className="container-custom mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <NavbarBrand />

        <div className="flex items-center gap-6 lg:gap-10">
          <NavbarLinks />
          <NavbarActions />
        </div>
      </nav>
    </header>
  );
};
