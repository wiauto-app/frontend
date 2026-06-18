import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="py-5 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-6 flex-1">
            <div className="bg-white p-4 rounded-full shadow-sm shrink-0">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-md md:text-2xl font-bold text-blue-600 mb-2">
                Recibe más consejos y oportunidades
              </h3>
              <p className="text-slate-600 text-sm md:text-base">
                Suscríbete a nuestro newsletter y recibe tips para vender tu coche, novedades y oportunidades exclusivas en WiAuto.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="bg-white min-w-[250px] h-12"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6">
              Suscribirme <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
