import TasacionForm from "./components/TasacionForm"

const reasons = [
  'Conoces el valor real de tu auto y no lo vendes por debajo de su precio de mercado.',
  'Un precio correcto atrae más interesados y reduce el tiempo de venta.',
  'Tienes argumentos sólidos basados en datos reales, no en percepciones.',
  'Ya sea vender, comprar o esperar, sabes exactamente en qué punto está tu vehículo en el mercado.',
]

const steps = [
  { n: 1, label: 'Ingresa los\ndatos de tu\nvehículo',       big: false },
  { n: 2, label: 'Evaluación de\ncaracterísticas\nclave',    big: true  },
  { n: 3, label: 'Comparación\ncon el\nmercado real',        big: false },
  { n: 4, label: 'Recibe tu\nprecio\nestimado',              big: true  },
  { n: 5, label: 'Publica o\nnegocia con\nconfianza',        big: false },
]

export default function TasacionPage() {
  return (
    <div className="w-full bg-[#F3F6FB]">

      <div className="w-full bg-[#DBE6F8] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-start mb-4 flex items-center gap-3">
            <span className="text-black">Tasacion de </span>
            <span className="text-blue-700"> coches</span>
          </h1>
          <div className="w-20 h-1 bg-blue-700 mt-4" />
        </div>
      </div>

      <div className="bg-[#F3F6FB] w-full">
        <div className="max-w-[1100px] mx-auto  pt-12 pb-20 flex flex-col gap-2">

          <div className="flex flex-row justify-between gap-8">
            <div className="lg:max-w-[58%] flex flex-col gap-5">
              <h2 className="text-[1.05rem] font-bold text-slate-700">
                Valora un vehículo con el tasador de WiAuto
              </h2>
              <ul className="flex flex-col gap-5">
                {reasons.map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-[30px] h-[30px] rounded-full bg-[#1746C8] text-white text-[12px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-slate-500 text-[10px] leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full lg:w-[450px] shrink-0 self-start lg:mt-10 z-20  -translate-y-52">
              <TasacionForm />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div className="text-center flex flex-col gap-2.5">
              <h2 className="text-[1.5rem] font-bold text-slate-800">
                Descubre el valor de tu auto en minutos
              </h2>
              <p className="text-slate-500 text-[13.5px] max-w-2xl mx-auto leading-relaxed">
                Obtén una estimación precisa del valor de tu vehículo en minutos, basada en datos reales del mercado.
                Solo ingresa la información y descubre cuánto vale hoy.
              </p>
            </div>

            <div className="hidden md:block relative w-full" style={{ height: '260px' }}>
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 260"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 100 185 C 150 185 150 75 250 75 C 350 75 350 185 500 185 C 650 185 650 75 750 75 C 850 75 850 185 900 185"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="3"
                  strokeDasharray="8 5"
                />
                <circle cx="100"  cy="185" r="5" fill="#CBD5E1" />
                <circle cx="250"  cy="75"  r="5" fill="#CBD5E1" />
                <circle cx="500"  cy="185" r="5" fill="#CBD5E1" />
                <circle cx="750"  cy="75"  r="5" fill="#CBD5E1" />
                <circle cx="900"  cy="185" r="5" fill="#CBD5E1" />
              </svg>

              {steps.map((step, idx) => {
                const xPcts = [10, 25, 50, 75, 90]
                const xPct   = xPcts[idx]
                const top    = step.big ? '0px' : '110px'
                const bigSize   = 130
                const smallSize = 90

                return (
                  <div
                    key={step.n}
                    className="absolute flex flex-col items-center"
                    style={{
                      left:      `${xPct}%`,
                      top,
                      transform: 'translateX(-50%)',
                      width:     step.big ? bigSize : smallSize,
                    }}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full font-bold leading-tight text-center transition-transform hover:scale-105 ${
                        step.big
                          ? 'bg-white  border-[6px] border-[#0B1527] shadow-lg'
                          : 'bg-white  border-[5px] border-[#1746C8] shadow-md'
                      }`}
                      style={{
                        width:  step.big ? bigSize : smallSize,
                        height: step.big ? bigSize : smallSize,
                        fontSize: step.big ? '12px' : '11px',
                      }}
                    >
                      <span className="px-2 whitespace-pre-line">{step.label}</span>
                    </div>
                    <div
                      className={`absolute flex items-center justify-center rounded-full font-bold text-[11px] border-2 ${
                        step.big
                          ? 'bg-white border-[#0B1527]'
                          : 'bg-white  border-[#1746C8]'
                      }`}
                      style={{
                        width: 26, height: 26,
                        top:  -8, left: -8,
                      }}
                    >
                      {step.n}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-5 md:hidden">
              {steps.map(step => (
                <div key={step.n} className="flex items-center gap-4">
                  <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm ${
                    step.big ? 'bg-[#0B1527] text-white' : 'bg-white text-[#1746C8] border-4 border-[#1746C8]'
                  }`}>
                    {step.n}
                  </div>
                  <p className="text-[13px] font-semibold text-slate-700 whitespace-pre-line">{step.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
