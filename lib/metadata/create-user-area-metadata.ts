import type { Metadata } from "next";

export const createUserAreaMetadata = (
  title: string,
  description: string,
): Metadata => ({
  title,
  description,
});
