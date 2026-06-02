export const AUTONOMY_KM_OPTIONS = [50, 100, 200, 300, 400, 500, 600] as const;

export const BATTERY_KWH_OPTIONS = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
] as const;

export const formatAutonomyLabel = (km: number): string => `${km} km`;

export const formatBatteryLabel = (kwh: number): string => `${kwh} kWh`;
