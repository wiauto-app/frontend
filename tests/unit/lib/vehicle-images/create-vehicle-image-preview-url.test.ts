import { describe, expect, it } from "vitest";

import { fileNeedsClientHeicPreview } from "@/lib/vehicle-images/create-vehicle-image-preview-url";

describe("fileNeedsClientHeicPreview", () => {
  it("detecta HEIC por MIME", () => {
    const file = new File([""], "foto.heic", { type: "image/heic" });
    expect(fileNeedsClientHeicPreview(file)).toBe(true);
  });

  it("detecta HEIC por extensión sin MIME", () => {
    const file = new File([""], "foto.heic", { type: "" });
    expect(fileNeedsClientHeicPreview(file)).toBe(true);
  });

  it("no convierte JPEG", () => {
    const file = new File([""], "foto.jpg", { type: "image/jpeg" });
    expect(fileNeedsClientHeicPreview(file)).toBe(false);
  });
});
