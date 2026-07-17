export interface DealershipWeekDay {
  id: number;
  name: string;
  shortName: string;
}

/** Días 1=Lunes … 7=Domingo (espejo del backend). */
export const DEALERSHIP_WEEK_DAYS: DealershipWeekDay[] = [
  { id: 1, name: "Lunes", shortName: "L" },
  { id: 2, name: "Martes", shortName: "M" },
  { id: 3, name: "Miércoles", shortName: "X" },
  { id: 4, name: "Jueves", shortName: "J" },
  { id: 5, name: "Viernes", shortName: "V" },
  { id: 6, name: "Sábado", shortName: "S" },
  { id: 7, name: "Domingo", shortName: "D" },
];
