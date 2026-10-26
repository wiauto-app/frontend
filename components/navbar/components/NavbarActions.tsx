"use client";

import { MessagesNavLink } from "./MessagesNavLink";
import { NavbarPublishButton } from "./NavbarPublishButton";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserDropdown } from "./userDropdown";

export const NavbarActions = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex items-center  gap-1    ">
      <NavbarPublishButton />
      <MessagesNavLink />
      <NotificationsDropdown />
      <UserDropdown />
      {children}
    </div>
  );
};
