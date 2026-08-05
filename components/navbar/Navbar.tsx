import { BrandLogo } from "../ui/brandLogo";
import { ConditionalWrapper } from "../ui/ConditionalWrapper";
import { NavbarActions } from "./components/NavbarActions";
import { NavbarLinks } from "./components/NavbarLinks";
import { NavbarMobileMenu } from "./components/NavbarMobileMenu";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <nav
        aria-label="Navegación principal"
        className="container-custom mx-auto flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <ConditionalWrapper paths={["/usuario"]} justParticular>
          <BrandLogo />
        </ConditionalWrapper>

        <NavbarLinks />
        <NavbarActions />
        <NavbarMobileMenu />
      </nav>
    </header>
  );
};
