export interface Media {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: unknown | null;
  width: number | null;
  height: number | null;
  formats: MediaFormats | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface MediaFormats {
  thumbnail?: MediaFormat;
  small?: MediaFormat;
  medium?: MediaFormat;
  large?: MediaFormat;
}

export interface MediaFormat {
  ext: string;
  url: string;
  etag: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Boton {
  id: number;
  label: string;
  url: string;
}

export interface PlanesLinkAction {
  id: number;
  label: string;
  url: string;
  destacado: boolean | null;
}

export interface PlanesHero {
  id: number;
  titulo: string;
  descripcion: string;
  acciones: PlanesLinkAction[];
  imagen: Media | null;
}

export interface PlanesEstadistica {
  id: number;
  estadistica: string;
  descripcion: string;
}

export interface PlanesSectionHeader {
  id: number;
  titulo: string;
  descripcion: string;
}

export interface PlanesCaracteristicaItem {
  id: number;
  label: string;
  descripcion: string | null;
  icon: Media;
}

export interface PlanesCaracteristicasBlock {
  id: number;
  header: PlanesSectionHeader;
  caracteristicas: PlanesCaracteristicaItem[];
}

export interface PlanesTechBlock {
  id: number;
  header: PlanesSectionHeader;
  caracteristicas: PlanesCaracteristicaItem[];
  imagen: Media | null;
}

export interface PlanesMobileBlock {
  id: number;
  header: PlanesSectionHeader;
  imagen: Media | null;
  apple: Boton | null;
  google: Boton | null;
  caracteristicas: PlanesCaracteristicaItem[];
}

export interface PlanesPageResponse {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: PlanesHero | null;
  estadisticas: PlanesEstadistica[];
  caracteristicas: PlanesCaracteristicasBlock | null;
  tech_add: PlanesTechBlock | null;
  mobile_advertisment: PlanesMobileBlock | null;
}

export type StrapiPlanesResponse = {
  data: PlanesPageResponse;
};
