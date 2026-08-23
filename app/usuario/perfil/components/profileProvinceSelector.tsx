import { InputSkeleton } from "@/components/ui/inputSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { provincesCatalogService } from "@/services/locations/provincesCatalogService";
import { useQuery } from "@tanstack/react-query";

export const ProfileProvinceSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile-province-selector"],
    queryFn: () => provincesCatalogService.findAll({ page: 1, limit: 100 }),
  });
  const provinces = data?.data || [];

  if (isLoading) {
    return <InputSkeleton />;
  }
  return (
    <Select
      items={provinces.map((province) => ({
        label: province.name,
        value: province.id.toString(),
      }))}
      value={value ?? undefined}
      onValueChange={(value) => onChange(value ?? "")}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona una provincia" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px] overflow-y-auto">
        {provinces.map((province) => (
          <SelectItem key={province.id} value={province.id.toString()}>
            {province.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
