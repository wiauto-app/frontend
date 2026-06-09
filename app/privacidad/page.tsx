import React from 'react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "1. Responsable del tratamiento",
      content: (
        <>
          <p className="mb-2">El responsable del tratamiento de tus datos personales es:</p>
          <p className="font-semibold text-gray-900">WiAuto España S.L.</p>
          <p>Domicilio: [Dirección]</p>
          <p>Correo electrónico: privacidad@wiauto.com</p>
        </>
      )
    },
    {
      title: "2. Información que recopilamos",
      content: (
        <>
          <p className="mb-2">Recopilamos los siguientes datos personales:</p>
          <p className="font-semibold mt-3">Datos de registro</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nombre y apellidos</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Contraseña (encriptada)</li>
          </ul>
          <p className="font-semibold mt-3">Datos relacionados con vehículos</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Información de los vehículos publicados</li>
            <li>Fotografías y descripciones</li>
          </ul>
          <p className="font-semibold mt-3">Datos de comunicación</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mensajes intercambiados entre usuarios</li>
            <li>Solicitudes de contacto</li>
          </ul>
          <p className="font-semibold mt-3">Datos de uso</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dirección IP</li>
            <li>Tipo de dispositivo y navegador</li>
            <li>Actividad dentro de la plataforma</li>
            <li>Preferencias y búsquedas</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Finalidad del tratamiento",
      content: (
        <>
          <p className="mb-2">Utilizamos tus datos para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Gestionar tu cuenta de usuario</li>
            <li>Permitir la publicación y gestión de anuncios</li>
            <li>Facilitar el contacto entre usuarios</li>
            <li>Mejorar la experiencia en la plataforma</li>
            <li>Personalizar contenidos y recomendaciones</li>
            <li>Prevenir fraudes y garantizar la seguridad</li>
            <li>Enviar comunicaciones relacionadas con el servicio</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Base legal",
      content: (
        <>
          <p className="mb-2">El tratamiento de tus datos se basa en:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold">Ejecución de un contrato:</span> uso de la plataforma</li>
            <li><span className="font-semibold">Interés legítimo:</span> mejora del servicio y prevención de fraude</li>
            <li><span className="font-semibold">Consentimiento:</span> para comunicaciones comerciales (cuando aplique)</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Compartición de datos",
      content: (
        <>
          <p className="mb-2">WiAuto no vende tus datos personales.</p>
          <p className="mb-2">Podemos compartir información con:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Proveedores tecnológicos (hosting, almacenamiento)</li>
            <li>Servicios de mensajería y comunicación</li>
            <li>Plataformas de pago (si aplica)</li>
          </ul>
          <p className="mt-2">Estos proveedores cumplen con la normativa de protección de datos.</p>
        </>
      )
    },
    {
      title: "6. Conservación de datos",
      content: (
        <>
          <p className="mb-2">Tus datos serán conservados:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mientras mantengas una cuenta activa</li>
            <li>Durante el tiempo necesario para cumplir obligaciones legales</li>
            <li>Hasta que solicites su eliminación</li>
          </ul>
        </>
      )
    },
    {
      title: "7. Derechos del usuario",
      content: (
        <>
          <p className="mb-2">Como usuario, tienes derecho a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Acceder a tus datos personales</li>
            <li>Rectificar datos incorrectos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Limitar el tratamiento</li>
            <li>Oponerte al uso de tus datos</li>
            <li>Solicitar la portabilidad de los datos</li>
          </ul>
          <p className="mt-3">Puedes ejercer estos derechos:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Desde tu panel de usuario</li>
            <li>O escribiendo a: privacidad@wiauto.com</li>
          </ul>
        </>
      )
    },
    {
      title: "8. Cookies",
      content: (
        <>
          <p>WiAuto utiliza cookies para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mantener tu sesión activa</li>
            <li>Analizar el uso de la plataforma</li>
            <li>Personalizar contenido</li>
          </ul>
          <p className="mt-2">Puedes gestionar o desactivar las cookies desde tu navegador o configuración de la plataforma.</p>
          <p className="mt-2">Para más información, consulta la Política de Cookies.</p>
        </>
      )
    },
    {
      title: "9. Seguridad",
      content: (
        <>
          <p>WiAuto aplica medidas de seguridad para proteger tus datos:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cifrado en tránsito (TLS)</li>
            <li>Cifrado en reposo</li>
            <li>Control de accesos</li>
            <li>Auditorías periódicas</li>
          </ul>
          <p className="mt-2">No obstante, ningún sistema es completamente seguro.</p>
        </>
      )
    },
    {
      title: "10. Transferencias internacionales",
      content: (
        <>
          <p>En caso de utilizar proveedores fuera del Espacio Económico Europeo, se garantizará el cumplimiento de medidas adecuadas conforme al RGPD.</p>
        </>
      )
    },
    {
      title: "11. Cambios en la política",
      content: (
        <>
          <p>WiAuto podrá actualizar esta Política de Privacidad en cualquier momento.</p>
          <p className="mt-2">Los cambios serán publicados en esta página con su fecha de actualización.</p>
        </>
      )
    },
    {
      title: "12. Contacto",
      content: (
        <>
          <p>Para cualquier consulta sobre privacidad o protección de datos:</p>
          <p className="font-semibold mt-2">[EMAIL_ADDRESS]</p>
        </>
      )
    }
  ];

  return (
    <>
      <div className="w-full bg-[#DBE6F8] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-black">Políticas de </span>
            <span className="text-blue-700">privacidad</span>
          </h1>
          <div className="w-35 h-1 bg-blue-700 rounded-full"></div>
        </div>
      </div>

      <div className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-blue prose-lg text-gray-700">
          {sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              {section.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;