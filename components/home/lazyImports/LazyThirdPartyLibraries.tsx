"use client";

import dynamic from "next/dynamic";

export const LazyThirdPartyLibraries = dynamic(
  () =>
    import("./ThirdPartyLibrariesInner").then(
      (mod) => mod.ThirdPartyLibrariesInner,
    ),
  { ssr: false },
);
