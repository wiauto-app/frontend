import type { Ref } from "react";

export const HONEYPOT_FIELD_NAME = "hp_website";

interface HoneypotFieldProps {
  ref?: Ref<HTMLInputElement>;
  id?: string;
}

/**
 * Campo trampa antispam. Fuera de pantalla (no `display: none`, que muchos
 * bots detectan), sin foco por teclado y oculto a lectores de pantalla. Una
 * persona nunca lo rellena; si llega con valor, el backend descarta el envío.
 */
export const HoneypotField = ({
  ref,
  id = HONEYPOT_FIELD_NAME,
}: HoneypotFieldProps) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
  >
    <label htmlFor={id}>No rellenes este campo</label>
    <input
      ref={ref}
      id={id}
      type="text"
      name={HONEYPOT_FIELD_NAME}
      tabIndex={-1}
      autoComplete="off"
      defaultValue=""
    />
  </div>
);

/**
 * Añade `hp_website` al payload solo si tiene valor, para no enviar el campo
 * en los envíos legítimos (y no depender del orden de despliegue del backend).
 */
export const buildHoneypotPayload = (
  value: string | null | undefined,
): { hp_website?: string } => {
  const trimmed = value?.trim();
  return trimmed ? { hp_website: trimmed } : {};
};
