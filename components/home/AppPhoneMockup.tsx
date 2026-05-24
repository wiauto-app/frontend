const BRAND_BLUE = "#0061F2";
const BRAND_DARK = "#0A193C";

export function AppPhoneMockup() {
  return (
    <div className="relative mx-auto w-[230px] sm:w-[260px]">
      <div className="rounded-[2.25rem] border-[7px] border-slate-900 bg-slate-900 p-1 shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
        <div className="relative overflow-hidden rounded-[1.65rem]">
          <div
            className="absolute left-1/2 top-1.5 z-20 h-[18px] w-[90px] -translate-x-1/2 rounded-full bg-slate-900"
            aria-hidden
          />

          <div className="pt-7" style={{ backgroundColor: BRAND_DARK }}>
            <div className="pb-6 pt-2 text-center text-xl font-bold text-white">
              <span>Wi</span>
              <span style={{ color: BRAND_BLUE }}>Auto</span>
            </div>
          </div>

          <div className="-mt-4 rounded-t-[1.25rem] bg-white px-4 pb-5 pt-5">
            <p className="text-[10px] leading-snug text-slate-600">
              Por favor, introduce tu correo electrónico y contraseña para continuar.
            </p>

            <div className="mt-3 space-y-2.5">
              <FieldMock label="Correo electrónico" />
              <FieldMock label="Contraseña" />
            </div>

            <label className="mt-3 flex items-center gap-2 text-[9px] text-slate-600">
              <span className="size-3 shrink-0 rounded-[3px] border border-slate-300 bg-white" />
              Recordar credenciales
            </label>

            <p className="mt-2 text-[9px]" style={{ color: BRAND_BLUE }}>
              ¿Olvidaste tu contraseña?
            </p>

            <button
              type="button"
              className="mt-3 w-full rounded-lg py-2.5 text-[11px] font-bold text-white"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              Iniciar sesión
            </button>

            <p className="mt-3 text-center text-[9px] text-slate-600">
              ¿Aún no tienes una cuenta?{" "}
              <span className="font-bold" style={{ color: BRAND_BLUE }}>
                Crear Cuenta
              </span>
            </p>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-3 left-1/2 h-1 w-[72px] -translate-x-1/2 rounded-full bg-slate-600"
        aria-hidden
      />
    </div>
  );
}

function FieldMock({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-1 text-[9px] font-semibold text-slate-800">{label}</p>
      <div className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[10px] text-slate-400">
        Ingresa
      </div>
    </div>
  );
}
