
import { Card, CardContent } from "@/components/ui/card";
import { ContactInfo } from "./components/ContactInfo";
import ContectForm  from "./components/ContectForm";


const page = () => {
  return (
       <>
      <div className="w-full bg-[#DBE6F8] from-blue-700 to-blue-600 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-start mb-4  items-center gap-3">
            <span className="text-black">Datos</span>
            <span className="text-blue-700">de</span>
            <span className="text-blue-700">contacto</span>
          </h1>
          <div className="w-20 h-1 bg-blue-700 mt-4" />
        </div>
      </div>
      <ContactInfo />
      <ContectForm /> 
    </>
  )
}

export default page