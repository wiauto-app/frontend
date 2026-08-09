import { LandingHeader } from "@/components/ui/landingHeader";

import { Business } from "./components/business";
import { Equipo } from "./components/equipo";
import { InfoPageGrid } from "./components/infoPageGrid";
import { Values } from "./components/values";
import { aboutUsService } from "./services/aboutUsService";

const infoCards = [
  {
    name: "5,287",
    description: "Vehículos Activos",
    itsBgBlue: true,
  },
  {
    name: "12,400 +",
    description: "Vendedores",
    itsBgBlue: false,
  },
  {
    name: "24",
    description: "Provincias",
    itsBgBlue: false,
  },
  {
    name: "365",
    description: "Días Conectando Compradores y Vendedores",
    itsBgBlue: false,
  },
];

const SobreNosotrosPage = async () => {
  const data = await aboutUsService.findAll();
  if (!data) {
    return <div>No data found</div>;
  }
  return (
    <>
      <LandingHeader title="Sobre nosotros" />
      <div className="bg-[#F3F5F9] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <InfoPageGrid info={infoCards} />
          <Values data={data} />
          <Business data={data} />
          <Equipo data={data} />
        </div>
      </div>
    </>
  );
};

export default SobreNosotrosPage;
