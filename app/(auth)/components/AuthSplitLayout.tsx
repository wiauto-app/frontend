import { BrandLogo } from "@/components/ui/brandLogo";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** `auth.compartido.panel_titulo`; los saltos de línea se respetan. */
  panelTitulo?: string | null;
}

export const AuthSplitLayout = ({
  children,
  className,
  panelTitulo,
}: AuthSplitLayoutProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center p-4  md:h-screen 2xl:h-[70vh]",
        className,
      )}
    >
      <Card className="flex flex-col lg:flex-row w-full max-w-4xl  border p-0">
        <div className="relative flex-col items-center justify-center overflow-hidden bg-primary-dark flex lg:w-[37.4%]">
          <div className="relative z-10 px-8 text-center space-y-4">
            <BrandLogo variant="normal-base" className="w-52 h-20" />
            <h1 className="hidden md:block mb-4 text-center text-3xl leading-tight font-bold text-white whitespace-pre-line">
              {panelTitulo || "Encuentra o vende\ntu próximo coche\nhoy!"}
            </h1>
          </div>
        </div>
        <CardContent className="md:py-6 pb-5">
          <div className="flex w-full items-center justify-center  lg:flex-1">
            <div className="w-full max-w-md space-y-4">{children}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
