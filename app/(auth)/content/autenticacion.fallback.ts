import { withStrapiFallback, type StrapiFallback } from "@/lib/strapi-content";

import type { StrapiAutenticacionResponse } from "../types/strapi-autenticacion.types";

/**
 * Textos de respaldo del single type `autenticacion`.
 * Se usan si Strapi no responde o deja un campo vacío.
 */
export const AUTENTICACION_FALLBACK: StrapiFallback<StrapiAutenticacionResponse> = {
  compartido: {
    panel_titulo: "Encuentra o vende\ntu próximo coche\nhoy!",
    separador: "o",
    boton_google: "Continuar con Google",
    boton_apple: "Continuar con Apple ID",
  },
  registro: {
    seo: {
      metaTitle: "Registro",
      metaDescription: "Regístrate en WiAuto",
    },
    encabezado: { titulo: "Regístrate" },
    aviso_invitacion: {
      texto: "Te invitaron a unirte al equipo. Crea tu cuenta para continuar.",
      tipo: "info",
    },
    nombre: {
      label: "Nombre",
      placeholder: "Nombre",
      mensaje_invalido: "El nombre debe tener al menos 2 caracteres",
    },
    apellidos: {
      label: "Apellidos",
      placeholder: "Apellidos",
      mensaje_invalido: "El apellido debe tener al menos 2 caracteres",
    },
    email: {
      label: "Email",
      placeholder: "Email",
      mensaje_invalido: "Email inválido",
    },
    telefono: {
      label: "Teléfono",
      label_numero: "Número de teléfono",
      placeholder_numero: "Número de móvil",
    },
    contrasena: {
      label: "Contraseña",
      placeholder: "Contraseña",
      mensaje_invalido: "La contraseña debe tener al menos 6 caracteres",
    },
    terminos: {
      texto: [
        {
          type: "paragraph",
          children: [
            { type: "text", text: "Acepto las " },
            {
              type: "link",
              url: "/terminos",
              children: [{ type: "text", text: "condiciones de uso" }],
            },
            { type: "text", text: " y la " },
            {
              type: "link",
              url: "/privacidad",
              children: [
                {
                  type: "text",
                  text: "información básica de protección de datos",
                },
              ],
            },
            { type: "text", text: "." },
          ],
        },
      ],
      mensaje_requerido: "Debes aceptar las condiciones de uso",
    },
    boton: { label: "Crear cuenta", label_cargando: "Creando cuenta..." },
    pie: {
      texto: "¿Ya tienes una cuenta?",
      enlace: { label: "Iniciar sesión", url: "/iniciar-sesion" },
    },
    mensajes: {
      exito: "Revisa tu correo para verificar la cuenta e iniciar sesión.",
      error_generico:
        "Hubo un error al crear tu cuenta. Por favor, inténtalo de nuevo.",
    },
  },
  login: {
    seo: {
      metaTitle: "Iniciar sesión",
      metaDescription: "Inicia sesión en tu cuenta de WiAuto",
      noIndex: true,
    },
    encabezado: { titulo: "Inicia Sesión" },
    email: {
      label: "Email",
      placeholder: "ejemplo@correo.com",
      mensaje_invalido: "Email inválido",
    },
    contrasena: {
      label: "Contraseña",
      mensaje_invalido: "La contraseña debe tener al menos 6 caracteres",
    },
    recordar_sesion: {
      texto: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "No cerrar sesión" }],
        },
      ],
    },
    boton: { label: "Iniciar Sesión", label_cargando: "Cargando..." },
    pie: {
      texto: "¿Aún no tienes una cuenta?",
      enlace: { label: "Regístrate", url: "/registro" },
    },
    enlace_olvide_contrasena: {
      label: "¿Olvidaste la contraseña?",
      url: "/olvide-contrasena",
    },
    mensajes: {
      exito: "Sesión iniciada correctamente",
      error_generico: "Error al iniciar sesión",
    },
  },
  olvide_contrasena: {
    seo: {
      metaTitle: "Olvidé mi contraseña",
      metaDescription: "Recupera tu contraseña en WiAuto",
      noIndex: true,
    },
    encabezado: {
      titulo: "Restablece tu contraseña",
      descripcion:
        "Introduce tu cuenta de email y te enviaremos un enlace con el que restablecer tu contraseña.",
    },
    encabezado_enviado: {
      titulo: "Revisa tu email",
      descripcion:
        "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.",
    },
    email: {
      label: "Email",
      placeholder: "Email",
      mensaje_invalido: "Email inválido",
    },
    boton: { label: "Enviar enlace", label_cargando: "Enviando..." },
    enlace_volver: { label: "Volver a iniciar sesión", url: "/iniciar-sesion" },
    mensajes: {
      error_generico:
        "Error al enviar el correo electrónico. Por favor, intenta de nuevo.",
    },
  },
  cambiar_contrasena: {
    seo: {
      metaTitle: "Cambiar contraseña",
      metaDescription: "Cambia tu contraseña en WiAuto",
      noIndex: true,
    },
    encabezado: {
      titulo: "Cambia tu contraseña",
      descripcion: "Introduce tu nueva contraseña para continuar.",
    },
    contrasena: {
      label: "Nueva contraseña",
      placeholder: "********",
      mensaje_invalido: "La contraseña debe tener al menos 6 caracteres",
    },
    boton: { label: "Guardar", label_cargando: "Cargando..." },
    boton_limpiar: "Limpiar",
    pie: {
      texto: "¿No tienes una cuenta?",
      enlace: { label: "Regístrate", url: "/registro" },
    },
    mensajes: {
      error_generico:
        "Error al cambiar la contraseña. Por favor, intenta de nuevo.",
    },
    encabezado_enlace_invalido: {
      titulo: "Enlace inválido",
      descripcion:
        "El enlace de recuperación no es válido o ya expiró. Solicita uno nuevo.",
    },
    boton_solicitar_enlace: {
      label: "Solicitar nuevo enlace",
      url: "/olvide-contrasena",
    },
    enlace_volver: { label: "Volver a iniciar sesión", url: "/iniciar-sesion" },
  },
  confirmar_correo: {
    seo: {
      metaTitle: "Confirmar correo",
      metaDescription: "Confirma tu correo electrónico en WiAuto",
      noIndex: true,
    },
    encabezado: {
      titulo: "Revisa tu correo",
      descripcion:
        "Te enviamos un enlace para verificar tu cuenta. Al hacer clic, iniciarás sesión automáticamente.",
    },
    ayuda:
      "Si no lo ves, revisa la carpeta de spam o solicita un nuevo enlace desde la pantalla de inicio de sesión.",
    boton: { label: "Ir a iniciar sesión", url: "/iniciar-sesion" },
    pie: {
      texto: "¿Ya verificaste?",
      enlace: { label: "Inicia sesión", url: "/iniciar-sesion" },
    },
  },
  verificacion_2fa: {
    seo: {
      metaTitle: "Verificación en dos pasos",
      metaDescription: "Verifica tu identidad para acceder a tu cuenta de WiAuto",
      noIndex: true,
    },
    encabezado: {
      titulo: "Verificación en dos pasos",
      descripcion: "Ingresa el código de tu autenticador para",
    },
    codigo: {
      label: "Código de verificación de 6 dígitos",
      mensaje_invalido: "Código inválido",
    },
    boton_verificar: { label: "Verificar" },
    codigo_respaldo: {
      label: "Código de respaldo",
      placeholder: "XXXX-XXXX",
      mensaje_invalido: "El código debe tener el formato XXXX-XXXX.",
    },
    boton_verificar_respaldo: { label: "Verificar código de respaldo" },
    boton_usar_respaldo: "Usar código de respaldo",
    boton_usar_autenticador: "Usar código del autenticador",
    boton_volver: "Volver al inicio de sesión",
    mensajes: {
      exito: "Verificación completada",
      error_generico: "Código incorrecto",
    },
    mensajes_respaldo: {
      exito: "Código de respaldo validado",
      error_generico: "Código de respaldo incorrecto",
    },
    texto_cargando: "Cargando verificación...",
  },
};

/** Respaldo completo, listo para componentes que se usan fuera de las páginas de auth. */
export const AUTENTICACION_DEFAULT = withStrapiFallback<StrapiAutenticacionResponse>(
  null,
  AUTENTICACION_FALLBACK,
);
