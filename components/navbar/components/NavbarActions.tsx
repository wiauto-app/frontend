"use client";

import { NavbarPublishButton } from "./NavbarPublishButton";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserDropdown } from "./userDropdown";

export const NavbarActions = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex items-center lg:gap-2 gap-2 ">
      <NavbarPublishButton />
      <NotificationsDropdown />
      <UserDropdown />
      {children}
    </div>
  );
};
