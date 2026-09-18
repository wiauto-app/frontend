import { getAllColaboraciones } from "@/services/colaboracionesService";
import { BrandLogo } from "../ui/brandLogo";
import { NavbarActions } from "./components/NavbarActions";
import { NavbarLinks } from "./components/NavbarLinks";
import { NavbarMobileMenu } from "./components/NavbarMobileMenu";
import { NavbarContainer } from "./components/navbarContainer";

export const Navbar = async() => {
  const colaboraciones = await getAllColaboraciones();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <NavbarContainer>
        <BrandLogo
          className="w-32 lg:w-44 "
          sizes="130px"
        />
        <NavbarLinks colaboraciones={colaboraciones} />
        <NavbarActions>
          <NavbarMobileMenu colaboraciones={colaboraciones} />
        </NavbarActions>
      </NavbarContainer>
    </header>
  );
};
