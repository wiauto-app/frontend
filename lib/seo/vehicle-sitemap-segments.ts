export function getVehicleSitemapSegmentIds(totalPages: number): string[] {
  if (totalPages <= 0) {
    return ["0"];
  }

  return Array.from({ length: totalPages }, (_, index) => String(index));
}
