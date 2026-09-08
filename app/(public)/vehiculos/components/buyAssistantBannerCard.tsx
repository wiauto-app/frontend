import { BuyAssistantButton } from "./buyAssistantButton";

export const BuyAssistantBannerCard = () => {
  return (
    <div className="2xl:p-6 p-4 w-full bg-linear-to-r from-purple via-purple-dark to-purple-dark rounded-3xl flex flex-col 2xl:gap-5 gap-3">
      <h4 className=" text-2xl 2xl:text-4xl font-bold text-white max-w-lg">
        Encuentra tu próximo vehículo con{" "}
        <span className="text-purple">IA</span>
      </h4>
      <p className="text-sm text-white ">
        Nuestra inteligencia artificial analiza miles de opciones para mostrarte
        las mejores para tí.
      </p>
      <BuyAssistantButton />
    </div>
  );
};
