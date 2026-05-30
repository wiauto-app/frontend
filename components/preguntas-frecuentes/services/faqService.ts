import type { FaqItem } from "../types/faq.types";

const DEFAULT_FAQS: FaqItem[] = [
  { id: "1", pregunta: "Mauris id nibh eu fermentum mattis purus?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
  { id: "2", pregunta: "Eros imperdiet rhoncus?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
  { id: "3", pregunta: "Fames imperdiet quam fermentum?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
  { id: "4", pregunta: "Varius vitae, convallis amet lacus sit aliquet nibh?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
  { id: "5", pregunta: "Tortor nisl pellentesque sit quis orci dolor?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
  { id: "6", pregunta: "Vestibulum mauris mauris elementum proin amet auctor ipsum nibh sollicitudin?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
  { id: "7", pregunta: "Vestibulum mauris mauris elementum proin amet auctor ipsam nibh sollicitudin?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
  { id: "8", pregunta: "Vestibulum mauris mauris elementem proin amet auctor ipsum nibh sollicitudin?", respuesta: [{ type: "paragraph", children: [{ type: "text", text: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis." }] }] },
];

export const getFaqData = async (): Promise<{ items: FaqItem[]; image: null }> => {
  return { items: DEFAULT_FAQS, image: null };
};
