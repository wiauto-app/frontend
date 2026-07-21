import { PARTNER_LOGOS } from '../constants';

export function SegurosPartnersSection() {
  return (
    <section className='bg-white py-5 sm:py-6'>
      <div className='container-custom mx-auto'>
        <div className='text-center'>
          <h2 className='text-xl font-extrabold text-slate-900'>
            Aliados para brindarte la mejor experiencia
          </h2>
          <p className='mt-3 text-slate-500'>
            Compara ofertas de las principales aseguradoras del mercado.
          </p>
        </div>

        <div className='mx-auto mt-8 md:mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
          {PARTNER_LOGOS.map((name) => (
            <div
              key={name}
              className='flex items-center justify-center rounded-xl border border-slate-100 bg-white px-4 py-6 shadow-sm hover:shadow-md transition-shadow'
            >
              <span className='text-lg font-bold text-slate-600'>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
