"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { NumericRangeValue } from "./types";

const YEAR_OPTIONS = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
  2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988,
  1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975,
  1974, 1973, 1972, 1971,
];

type YearSelectorProps = {
  value: NumericRangeValue;
  onChange: (value: NumericRangeValue) => void;
};

export const YearSelector = ({ value, onChange }: YearSelectorProps) => {
  const yearItems = YEAR_OPTIONS.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={value.since?.toString() ?? ""}
        onValueChange={(raw) =>
          onChange({ ...value, since: raw ? Number(raw) : undefined })
        }
        items={yearItems}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Desde" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {YEAR_OPTIONS.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={value.until?.toString() ?? ""}
        onValueChange={(raw) =>
          onChange({ ...value, until: raw ? Number(raw) : undefined })
        }
        items={yearItems}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Hasta" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {YEAR_OPTIONS.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
