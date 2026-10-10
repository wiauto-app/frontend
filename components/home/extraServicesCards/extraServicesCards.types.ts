/** Tarjeta normalizada de `homepage.servicios_extra` lista para pintar. */
export interface ExtraServiceCardItem {
  id: string;
  title: string;
  description: string;
  href: string;
  isExternal: boolean;
  /** URL absoluta de la imagen de fondo (Strapi) o null si no hay. */
  imageUrl: string | null;
  /** Color de acento (icono + flecha). Viene de `colorTexto`. */
  accentColor: string;
  /** Color de fondo cuando no hay imagen. Viene de `colorFondo`. */
  backgroundColor: string | null;
  /** Clave del icono en `extraServicesIconPack`. Viene de `iconName`. */
  iconName: string | null;
}
