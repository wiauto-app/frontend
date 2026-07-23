"use client";

export default function ConfirmEmailForm() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Revisa tu correo</h2>
        <p className="mt-2 text-sm text-gray-500">
          Te enviamos un enlace para verificar tu cuenta. Al hacer clic,
          iniciarás sesión automáticamente.
        </p>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Si no lo ves, revisa la carpeta de spam o solicita un nuevo enlace desde
        la pantalla de inicio de sesión.
      </p>

      <a
        href="/iniciar-sesion"
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Ir a iniciar sesión
      </a>

      <p className="text-center text-xs text-muted-foreground">
        ¿Ya verificaste?{" "}
        <a
          href="/iniciar-sesion"
          className="font-medium text-primary hover:underline"
        >
          Inicia sesión
        </a>
      </p>
    </>
  );
}
