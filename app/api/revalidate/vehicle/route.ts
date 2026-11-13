import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { vehicleCacheTag } from "@/lib/cache-tags";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidSecret = (received: string | null): boolean => {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !received) {
    return false;
  }
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

/**
 * Revalidación bajo demanda del detalle de un anuncio. La llama el backend
 * (servidor a servidor) cuando cambia el vehículo: edición, estado, vídeos…
 */
export async function POST(request: NextRequest) {
  if (!isValidSecret(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  let vehicleId: unknown;
  try {
    ({ vehicle_id: vehicleId } = (await request.json()) as {
      vehicle_id?: unknown;
    });
  } catch {
    return Response.json({ revalidated: false }, { status: 400 });
  }

  if (typeof vehicleId !== "string" || !UUID_RE.test(vehicleId)) {
    return Response.json({ revalidated: false }, { status: 400 });
  }

  // expire: 0 → la siguiente visita trae datos nuevos (sin servir la versión vieja)
  revalidateTag(vehicleCacheTag(vehicleId), { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
