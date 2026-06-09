
type infoProps = {
  logo:React.ReactNode;
  title:string;
  description:string;
  
};
import {  MapPin, Mail, Phone } from "lucide-react";


const info:infoProps[] = [
  {
    logo:<MapPin className="size-5" aria-hidden />,
    title:"Dirección",
    description:"España, Madrid",
  },
  {
    logo:<Mail className="size-5" aria-hidden />,
    title:"Correo electrónico",
    description:"comercial@wiauto.es",
  },
  {
    logo:<Phone className="size-5" aria-hidden />,
    title:"Teléfono",
    description:"+593 99 999 9999",
  },
]

export const ContactInfo = () => {
  return (
    <div className="my-10 flex gap-2 overflow-x-auto pb-4 scrollbar-hide justify-evenly">
      {info.map((info:infoProps) => (
        <div key={info.title} className="shrink-0">
          <div className="bg-card/50 backdrop-blur-md  min-w-64 p-4 rounded-xl flex items-center gap-4">
            <div className="rounded-full shadow-md shadow-primary/25  p-1 inline-flex items-center justify-center">
              <span className="text-primary border  p-3 rounded-full border-blue-400">{info.logo}</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-semibold">{info.title}</h4>
              <p className="text-muted-foreground text-sm">{info.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
