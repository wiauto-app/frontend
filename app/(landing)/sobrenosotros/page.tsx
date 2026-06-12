import { Equipo } from "./components/equipo"
import { InfoPageGrid } from "./components/infoPageGrid"
import { Values } from "./components/values"
import { Business } from "./components/business"


const infoCards = [
  {
    name:'5,287',
    description:'Vehículos Activos',
    itsBgBlue:true
  },
  {
    name:'12,400 +',
    description:'Vendeores',
    itsBgBlue:false
  },
  {
    name:'$120 M +',
    description:'Transado en 2024',
    itsBgBlue:false
  },
  {
    name:'4.9',
    description:'sactifacción',
    itsBgBlue:false
  },
]
const equipoData = [
    {
        name:'Maria',
        role:'Vendedor',
        img:'/maria.jpg'
    },
    {
        name:'Juan',
        role:'Asesor',
        img:'/juan.jpg'
    },
    {
      name:'Luis',
      role:'Desarrollador',
      img:'/luis.jpg'
    }
]

const SobreNosotrosPage = () => {

    return (
        <>
      <div className="w-full bg-[#DBE6F8] from-blue-700 to-blue-600 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-start mb-4 flex items-center gap-3">
            <span className="text-black">Sobre </span>
            <span className="text-blue-700"> Nosostros</span>
          </h1>
          <div className="w-20 h-1 bg-blue-700 mt-4" />
        </div>
      </div>
      <div className="bg-[#F3F5F9] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <InfoPageGrid info={infoCards}/>
          <Values/>
          <Business/>
          <Equipo  equipo={equipoData}/>
        </div>
      </div>
      
    </>
    )
}

export default SobreNosotrosPage