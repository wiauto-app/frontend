import { describe, expect, it } from "vitest";

import {
  normalize_compound_storage_path,
  split_storage_compound_path,
} from "@/services/files/filesService";

describe("normalize_compound_storage_path", () => {
  it("convierte URL HTTPS del CDN en ruta compuesta", () => {
    expect(
      normalize_compound_storage_path(
        "https://media.wiauto.es/vehicles-images/gallery/foo.webp",
      ),
    ).toBe("vehicles-images/gallery/foo.webp");
  });

  it("mantiene rutas compuestas sin barra inicial", () => {
    expect(normalize_compound_storage_path("/vehicles-images/a.webp")).toBe(
      "vehicles-images/a.webp",
    );
  });
});

describe("split_storage_compound_path con URL pública", () => {
  it("extrae bucket y clave tras normalizar", () => {
    const result = split_storage_compound_path(
      "https://cdn.example.com/vehicles-images/temp/x.jpg",
    );
    expect(result.bucket_name).toBe("vehicles-images");
    expect(result.object_key).toBe("temp/x.jpg");
  });
});