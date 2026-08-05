import { IAButton } from "@/components/ui/iaButton";
import { IconContainer } from "@/components/ui/iconContainer";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

export const BuyAssistantBannerCard = () => {
  return (
    <div className="p-6 col-span-1 md:col-span-3 h-fit bg-linear-to-r from-[#0A1238] via-[#0A1238] to-purple rounded-3xl flex flex-col gap-5">
      <h4 className="text-4xl font-bold text-white max-w-lg">
        Encuentra tu próximo vehículo con{" "}
        <span className="text-purple">IA</span>
      </h4>
      <p className="text-sm text-white max-w-sm">
        Nuestra inteligencia artificial analiza miles de opciones para mostrarte
        las mejores para tí.
      </p>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
        <IAButton
          size="2xl"
          className="rounded-2xl max-w-xl text-lg font-semibold w-fit"
        >
          <Sparkles className="size-6" />
          Comenzar búsqueda <ArrowRight className="size-5" />
        </IAButton>
        <div className="border border-white rounded-2xl p-4">
          <div>
            <IconContainer iconColor="white" Icon={Heart}/>
          </div>
        </div>
      </div>
    </div>
  );
};
