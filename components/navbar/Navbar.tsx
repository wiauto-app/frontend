import { BrandLogo } from "../ui/brandLogo";
import { NavbarActions } from "./components/NavbarActions";
import { NavbarMobileMenu } from "./components/NavbarMobileMenu";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <nav
        aria-label="Navegación principal"
        className="container-custom mx-auto flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <BrandLogo />

        <div className="flex items-center gap-3 sm:gap-4">
          {/* <NavbarLinks /> */}
          <NavbarActions />
          <NavbarMobileMenu />
        </div>
      </nav>
    </header>
  );
};
