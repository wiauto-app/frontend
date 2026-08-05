import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const getMatches = (query: string) => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    // Sincroniza el valor inicial
    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}