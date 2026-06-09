import React from 'react';

const TermsAndConditionsPage = () => {
  const sections = [
    {
      title: "1. Identificación del titular",
      content: (
        <>
          <p className="mb-2">El presente sitio web y plataforma (en adelante, "WIAuto") es operado por:</p>
          <p className="font-semibold text-gray-900">WIAuto España S.L.</p>
          <p>Domicilio: [Dirección]</p>
          <p>Correo electrónico: [email de contacto]</p>
        </>
      )
    },
    {
      title: "2. Aceptación de los términos",
      content: (
        <p>Al acceder, navegar o utilizar WIAuto, el usuario acepta expresamente estos Términos y Condiciones. Si no está de acuerdo con ellos, debes abstenerte de utilizar la plataforma.</p>
      )
    },
    {
      title: "3. Objeto de la plataforma",
      content: (
        <>
          <p className="mb-2">WIAuto es una plataforma digital que permite:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Publicar anuncios de vehículos</li>
            <li>Buscar y comparar coches</li>
            <li>Contactar entre compradores y vendedores</li>
            <li>Consultar y realizar operaciones comerciales</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Registro y cuenta de usuario",
      content: (
        <>
          <p className="mb-2">Para utilizar determinadas funcionalidades, el usuario debe registrarse. El usuario se compromete a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Proporcionar información veraz y actualizada</li>
            <li>Mantener la confidencialidad de sus credenciales</li>
            <li>No ceder su cuenta a terceros</li>
          </ul>
          <p className="mt-2">WiAuto podrá suspender o cancelar cuentas en caso de uso indebido.</p>
        </>
      )
    },
    {
      title: "5. Publicación de anuncios",
      content: (
        <>
          <p className="mb-2">El usuario que publique vehículos declara que:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>El vehículo existe y es de su propiedad o está autorizado para su venta</li>
            <li>La información proporcionada es veraz, completa y actualizada</li>
            <li>Las imágenes corresponden al vehículo real</li>
          </ul>
          <p className="mt-3 font-semibold">No está permitido:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Publicar anuncios falsos o engañosos</li>
            <li>Publicar anuncios con fines de manipulación</li>
            <li>Incluir contenido fraudulento o ilegal</li>
          </ul>
          <p className="mt-3 font-semibold">WIAuto se reserva el derecho de:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Modificar, suspender o eliminar anuncios</li>
            <li>Bloquear usuarios que incumplan estas condiciones</li>
          </ul>
        </>
      )
    },
    {
      title: "6. Responsabilidad sobre las transacciones",
      content: (
        <>
          <p className="font-semibold">WIAuto:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>No participa en la compraventa</li>
            <li>No garantiza la veracidad de los anuncios</li>
            <li>No verifica todos los vehículos ni documentos</li>
          </ul>
          <p className="mt-3 font-semibold">El usuario es responsable de:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Verificar el estado del vehículo</li>
            <li>Revisar documentación legal</li>
            <li>Realizar las comprobaciones necesarias antes de comprar</li>
          </ul>
        </>
      )
    },
    {
      title: "7. Comunicaciones y contacto",
      content: (
        <>
          <p className="mb-2">WIAuto puede ofrecer herramientas como:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Chat entre usuarios</li>
            <li>Solicitudes de contacto</li>
            <li>Intercambio de información</li>
          </ul>
          <p className="mt-2">El uso de estas herramientas debe ser adecuado, respetuoso y conforme a la ley.</p>
        </>
      )
    },
    {
      title: "8. Sistema de valoraciones y contenido",
      content: (
        <>
          <p>Los usuarios pueden dejar reseñas u opiniones. WIAuto podrá:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Moderar contenidos</li>
            <li>Eliminar opiniones ofensivas, falsas o ilegales</li>
          </ul>
        </>
      )
    },
    {
      title: "9. Propiedad intelectual",
      content: (
        <>
          <p>Todos los contenidos de la plataforma, incluyendo:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Diseño</li>
            <li>Logotipos</li>
            <li>Textos</li>
            <li>Software</li>
          </ul>
          <p className="mt-2">son propiedad de WIAuto España S.L. o de terceros autorizados. Queda prohibida su reproducción sin autorización expresa.</p>
        </>
      )
    },
    {
      title: "10. Protección de datos",
      content: (
        <>
          <p>El tratamiento de datos personales se rige por la normativa aplicable en España y la Unión Europea, incluyendo el Reglamento (UE) 2016/679 (RGPD).</p>
          <p className="mt-2">Para más información, consulta la Política de Privacidad.</p>
        </>
      )
    },
    {
      title: "11. Seguridad y prevención de fraude",
      content: (
        <>
          <p>WiAuto implementa medidas para detectar:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Actividades sospechosas</li>
            <li>Anuncios fraudulentos</li>
            <li>Comportamientos abusivos</li>
          </ul>
          <p className="mt-2">Sin embargo, no puede garantizar la ausencia total de fraude.</p>
        </>
      )
    },
    {
      title: "12. Servicios adicionales",
      content: (
        <>
          <p>WiAuto puede ofrecer servicios complementarios como:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Financiación</li>
            <li>Tasación</li>
            <li>Garantías</li>
            <li>Servicios de terceros</li>
          </ul>
          <p className="mt-2">Estos servicios pueden estar sujetos a condiciones adicionales.</p>
        </>
      )
    },
    {
      title: "13. Limitación de responsabilidad",
      content: (
        <>
          <p>WIAuto no será responsable por:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Daños derivados de acuerdos entre usuarios</li>
            <li>Información incorrecta publicada por terceros</li>
            <li>Pérdidas económicas derivadas de transacciones</li>
          </ul>
        </>
      )
    },
    {
      title: "14. Modificaciones",
      content: (
        <>
          <p>WIAuto podrá modificar estos términos en cualquier momento.</p>
          <p className="mt-2">Los cambios serán publicados en la plataforma con la fecha de actualización.</p>
        </>
      )
    },
    {
      title: "15. Legislación aplicable y jurisdicción",
      content: (
        <>
          <p>Estos Términos se rigen por la legislación española.</p>
          <p className="mt-2">Para cualquier conflicto, las partes se someterán a los juzgados y tribunales del domicilio del usuario o, en su defecto, de Madrid.</p>
        </>
      )
    }
  ];

  return (
    <>
      <div className="w-full bg-[#DBE6F8] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-black">Términos y </span>
            <span className="text-blue-700">condiciones</span>
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

export default TermsAndConditionsPage;