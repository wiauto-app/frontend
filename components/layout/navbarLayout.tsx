import React from "react";
import { Navbar } from "../navbar/Navbar";
import { AppDownloadBannerGate } from "../app-download/AppDownloadBannerGate";
import { EmailVerificationBanner } from "../auth/EmailVerificationBanner";

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div
        className="sticky top-0 z-40"
        style={{ viewTransitionName: "site-header" }}
      >
        <AppDownloadBannerGate />
        <EmailVerificationBanner />
        <Navbar />
        {children}
      </div>
    </>
  );
};
