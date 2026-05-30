export type StrapiBlock = Record<string, unknown>;

export type FaqItem = {
  id: string;
  pregunta: string;
  respuesta: StrapiBlock[];
};
