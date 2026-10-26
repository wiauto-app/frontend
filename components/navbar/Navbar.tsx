import { getAllColaboraciones } from "@/services/colaboracionesService";
import { BrandLogo } from "../ui/brandLogo";
import { NavbarActions } from "./components/NavbarActions";
import { NavbarLinks } from "./components/NavbarLinks";
import { NavbarMobileMenu } from "./components/NavbarMobileMenu";
import { NavbarContainer } from "./components/navbarContainer";
import { ConditionalWrapper } from "../ui/ConditionalWrapper";

export const Navbar = async () => {
  const colaboraciones = await getAllColaboraciones();
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <NavbarContainer>
        <ConditionalWrapper
          hideOnPaths={[
            "/usuario",
          ]}
        >
          <BrandLogo className="w-32 lg:w-44 " sizes="130px" />
        </ConditionalWrapper>
        <NavbarLinks colaboraciones={colaboraciones} />
        <NavbarActions>
          <NavbarMobileMenu colaboraciones={colaboraciones} />
        </NavbarActions>
      </NavbarContainer>
    </header>
  );
};
