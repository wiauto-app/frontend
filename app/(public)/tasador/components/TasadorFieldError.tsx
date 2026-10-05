/** Mensaje de error bajo un campo del formulario. */
export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;
