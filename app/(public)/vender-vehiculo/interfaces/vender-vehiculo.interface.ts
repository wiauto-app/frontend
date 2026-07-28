export interface VenderVehiculoResponse {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  imagen: Media[];

  profesional: Card;
  particular: Card;
  marketingCard: Card;

  ventajas: VentajasSection;
  comparacion: ComparacionSection;
  consejos: ConsejosSection;
  preguntas: PreguntasSection;
}

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

export interface Card {
  id: number;
  titulo: string;
  descripcion: string;
  colorFondo: string | null;
  colorTexto: string | null;
  iconName: string | null;
  boton: Boton | null;
  imagen: Media | null;
}

export interface VentajasSection {
  id: number;
  titulo: string;
  descripcion: string;
  ventaja: Card[];
}

export interface ComparacionSection {
  id: number;
  titulo: string;
  planes: Plan[];
}

export interface Plan {
  id: number;
  nombre: string;
  caracteristicas: CaracteristicaPlan[];
}

export interface CaracteristicaPlan {
  id: number;
  titulo: string;
  incluido: boolean | null;
}

export interface ConsejosSection {
  id: number;
  titulo: string;
  descripcion: string;
  consejo: Card[];
}

export interface PreguntasSection {
  id: number;
  titulo: string;
  pregunta: Pregunta[];
}

export interface Pregunta {
  id: number;
  titulo: string;
  descripcion: RichTextBlock[];
  orientacion: "horizontal" | "vertical";
  imagen: Media | null;
}

export interface RichTextBlock {
  type: string;
  children: RichTextChild[];
}

export interface RichTextChild {
  text: string;
  type: string;
}