"use client";

import { NavbarPublishButton } from "./NavbarPublishButton";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserDropdown } from "./userDropdown";

export const NavbarActions = () => {
  return (
    <div className="flex items-center gap-4 ">
      <NavbarPublishButton />
      <NotificationsDropdown />
      <UserDropdown />
    </div>
  );
};
