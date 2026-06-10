"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useNewsUrlUpdate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const replaceParams = (params: URLSearchParams) => {
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    const currentQuery = searchParams.toString();
    const currentUrl = currentQuery
      ? `${pathname}?${currentQuery}`
      : pathname;

    if (nextUrl === currentUrl) {
      return;
    }

    router.replace(nextUrl, { scroll: false });
  };

  return { searchParams, replaceParams };
};
