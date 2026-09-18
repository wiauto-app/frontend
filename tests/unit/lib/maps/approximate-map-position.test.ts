import { describe, expect, it } from "vitest";

import {
  buildCirclePathCoordinates,
  getApproximateMapPosition,
} from "@/lib/maps/approximate-map-position";

describe("getApproximateMapPosition", () => {
  it("devuelve la misma posición para la misma semilla", () => {
    const first = getApproximateMapPosition(40.4168, -3.7038, 500, "vehicle-1");
    const second = getApproximateMapPosition(40.4168, -3.7038, 500, "vehicle-1");

    expect(first).toEqual(second);
  });

  it("cambia la posición con otra semilla", () => {
    const first = getApproximateMapPosition(40.4168, -3.7038, 500, "vehicle-a");
    const second = getApproximateMapPosition(40.4168, -3.7038, 500, "vehicle-b");

    expect(first).not.toEqual(second);
  });

  it("mantiene el offset dentro del radio aproximado", () => {
    const origin = { lat: 40.4168, lng: -3.7038 };
    const nearby = getApproximateMapPosition(origin.lat, origin.lng, 500, "seed");

    const earthRadius = 6378137;
    const dLat = ((nearby.lat - origin.lat) * Math.PI) / 180;
    const dLng = ((nearby.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((nearby.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const distance = 2 * earthRadius * Math.asin(Math.sqrt(a));

    expect(distance).toBeLessThanOrEqual(500 + 1);
  });
});

describe("buildCirclePathCoordinates", () => {
  it("cierra el polígono con el mismo punto inicial y final", () => {
    const path = buildCirclePathCoordinates(40.4168, -3.7038, 350, 8);
    const points = path.split("|");

    expect(points[0]).toBe(points[points.length - 1]);
    expect(points).toHaveLength(9);
  });
});
