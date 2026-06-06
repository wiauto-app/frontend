import { buildVehicleListingHref } from "@/lib/vehicles/listing-url";
import Link from "next/link";
import { WiautoImage } from "../ui/wiautoImage";
import { Category } from "@/interfaces/vehicle.interface";
import { Card, CardContent, CardHeader } from "../ui/card";
export const CarTypeCard = ({ category }: { category: Category }) => {
  return (
    <Link
      key={category.id}
      href={buildVehicleListingHref({ type_slug: category.slug})}
    >
      <Card className=" w-64 gap-2 " size="sm">
        <CardHeader className="p-2">
          <div className="relative h-24 w-full aspect-square">
            <WiautoImage
              src={category.image_url || ""}
              alt={category.name}
              fill
              
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent >
          <p className="text-sm font-bold text-slate-900">{category.name}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
