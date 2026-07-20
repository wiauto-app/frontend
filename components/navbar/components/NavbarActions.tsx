"use client";

import { NavbarPublishButton } from "./NavbarPublishButton";
import { UserDropdown } from "./userDropdown";
import { NavbarDealership } from "./navbarDealership";

export const NavbarActions = () => {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <NavbarPublishButton />
      <NavbarDealership />
      <UserDropdown />
    </div>
  );
};
