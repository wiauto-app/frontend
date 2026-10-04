import { describe, expect, it } from "vitest";

import { withStrapiFallback } from "@/lib/strapi-content";

interface Boton {
  id: number;
  label: string;
  label_cargando: string | null;
}

interface Pantalla {
  id: number;
  titulo: string | null;
  boton: Boton | null;
  bloques: { type: string }[] | null;
  noIndex: boolean | null;
}

const FALLBACK = {
  titulo: "Respaldo",
  boton: { label: "Enviar", label_cargando: "Enviando..." },
  bloques: [{ type: "paragraph" }],
  noIndex: true,
};

describe("withStrapiFallback", () => {
  it("usa el respaldo completo cuando Strapi no responde", () => {
    expect(withStrapiFallback<Pantalla>(null, FALLBACK)).toEqual(FALLBACK);
  });

  it("respeta los valores de Strapi y solo rellena los vacíos", () => {
    const result = withStrapiFallback<Pantalla>(
      {
        id: 1,
        titulo: "",
        boton: { id: 2, label: "Crear", label_cargando: null },
        bloques: [],
        noIndex: false,
      },
      FALLBACK,
    );

    expect(result).toEqual({
      id: 1,
      titulo: "Respaldo",
      boton: { id: 2, label: "Crear", label_cargando: "Enviando..." },
      bloques: [{ type: "paragraph" }],
      noIndex: false,
    });
  });

  it("no reemplaza arrays con contenido", () => {
    const bloques = [{ type: "heading" }];
    const result = withStrapiFallback<Pantalla>(
      { id: 1, titulo: null, boton: null, bloques, noIndex: null },
      FALLBACK,
    );

    expect(result.bloques).toBe(bloques);
  });
});
