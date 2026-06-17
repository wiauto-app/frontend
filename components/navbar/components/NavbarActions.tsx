"use client";

import { NavbarPublishButton } from "./NavbarPublishButton";
import { UserDropdown } from "./userDropdown";

export const NavbarActions = () => {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <NavbarPublishButton />
      <UserDropdown />
    </div>
  );
};
