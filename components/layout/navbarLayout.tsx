import React from "react";
import { Navbar } from "../navbar/Navbar";
import { AppDownloadBannerGate } from "../app-download/AppDownloadBannerGate";

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div
        className="sticky top-0 z-40"
        style={{ viewTransitionName: "site-header" }}
      >
        <AppDownloadBannerGate />
        <Navbar />
        {children}
      </div>
    </>
  );
};
