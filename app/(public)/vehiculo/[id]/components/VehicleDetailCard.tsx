import { Card, CardContent } from "@/components/ui/card";
import { CustomSeparator } from "@/components/ui/customSeparator";

export const VehicleDetailCard = ({
  title,
  children,
}: {
  title: React.ReactNode | string;
  children: React.ReactNode;
}) => {
  return (
    <Card size="sm">
      <CardContent className="space-y-5">
        <h2 className=" text-lg font-semibold text-gray-900 flex items-center gap-2">{title}</h2>
        <CustomSeparator />
        {children}
      </CardContent>
    </Card>
  );
};
