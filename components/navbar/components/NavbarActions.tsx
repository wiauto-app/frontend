"use client";

import { NavbarPublishButton } from "./NavbarPublishButton";
import { NavbarUserMenu } from "./NavbarUserMenu";

export const NavbarActions = () => {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <NavbarPublishButton />
      <NavbarUserMenu />
    </div>
  );
};
