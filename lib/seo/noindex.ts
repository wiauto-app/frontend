import type { Metadata } from "next";

/** Thin / low-value pages: keep crawl equity, drop from the index. */
export const NOINDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
};

/** Unavailable inventory (sold, inactive, etc.): do not index or pass link equity. */
export const NOINDEX_NOFOLLOW_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};
