import { BrandLogo } from "@/components/ui/brandLogo";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthSplitLayout = ({
  children,
  className,
}: AuthSplitLayoutProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center p-4  md:h-screen 2xl:h-[70vh]",
        className,
      )}
    >
      <Card className="flex flex-col lg:flex-row w-full max-w-4xl  border p-0">
        <div className="relative flex-col items-center justify-center overflow-hidden bg-blue-700 flex lg:w-[37.4%]">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-blue-800" />
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-white/5" />
          <div className="relative z-10 px-8 text-center">
            <BrandLogo variant="icon" className="h-20 w-20" />
            <h1 className="hidden md:block mb-4 text-center text-3xl leading-tight font-bold text-white">
              Encuentra o vende
              <br />
              tu próximo coche
              <br />
              hoy!
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
