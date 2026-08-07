import { BuyAssistantButton } from "./buyAssistantButton";

export const BuyAssistantBannerCard = () => {
  return (
    <div className="p-6 w-full bg-linear-to-r from-purple-dark via-purple-dark to-purple rounded-3xl flex flex-col gap-5">
      <h4 className="text-4xl font-bold text-white max-w-lg">
        Encuentra tu próximo vehículo con{" "}
        <span className="text-purple">IA</span>
      </h4>
      <p className="text-sm text-white max-w-sm">
        Nuestra inteligencia artificial analiza miles de opciones para mostrarte
        las mejores para tí.
      </p>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
        <BuyAssistantButton />
      </div>
    </div>
  );
};
