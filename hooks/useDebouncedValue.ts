"use client";

import { useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debounced_value, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout_id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout_id);
  }, [value, delay]);

  return debounced_value;
};
