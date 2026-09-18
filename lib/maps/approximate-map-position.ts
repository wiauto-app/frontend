/**
 * Offset determinista alrededor de un punto (misma semilla → misma posición).
 * Útil para no filtrar la ubicación exacta y mantener URL de Static Map cacheable.
 */
export const getApproximateMapPosition = (
  lat: number,
  lng: number,
  radiusMeters = 500,
  seed = `${lat},${lng}`,
): { lat: number; lng: number } => {
  const random = createSeededRandom(seed);
  const earthRadius = 6378137;
  const distance = random() * radiusMeters;
  const bearing = random() * Math.PI * 2;

  const offsetLat = (distance * Math.cos(bearing)) / earthRadius;
  const offsetLng =
    (distance * Math.sin(bearing)) /
    (earthRadius * Math.cos((lat * Math.PI) / 180));

  return {
    lat: lat + (offsetLat * 180) / Math.PI,
    lng: lng + (offsetLng * 180) / Math.PI,
  };
};

const createSeededRandom = (seed: string): (() => number) => {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

/** Polígono cerrado aproximando un círculo para `path` de Static Maps. */
export const buildCirclePathCoordinates = (
  lat: number,
  lng: number,
  radiusMeters: number,
  points = 32,
): string => {
  const earthRadius = 6378137;
  const coordinates: string[] = [];

  for (let index = 0; index <= points; index += 1) {
    const bearing = (2 * Math.PI * index) / points;
    const offsetLat = (radiusMeters * Math.cos(bearing)) / earthRadius;
    const offsetLng =
      (radiusMeters * Math.sin(bearing)) /
      (earthRadius * Math.cos((lat * Math.PI) / 180));

    const pointLat = lat + (offsetLat * 180) / Math.PI;
    const pointLng = lng + (offsetLng * 180) / Math.PI;
    coordinates.push(`${pointLat.toFixed(6)},${pointLng.toFixed(6)}`);
  }

  return coordinates.join("|");
};
