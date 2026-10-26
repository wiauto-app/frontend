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

interface ProfileProvinceSelectorProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export const ProfileProvinceSelector = ({
  value,
  onChange,
}: ProfileProvinceSelectorProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile-province-selector"],
    queryFn: () => provincesCatalogService.findAll({ page: 1, limit: 100 }),
  });
  const provinces = data?.data || [];

  if (isLoading) {
    return <InputSkeleton />;
  }

  const selectedValue = value != null ? String(value) : "";

  const handleValueChange = (next: string | null | undefined) => {
    if (next == null || next === "") {
      onChange(undefined);
      return;
    }

    const parsed = Number(next);
    onChange(Number.isFinite(parsed) ? parsed : undefined);
  };

  return (
    <Select
      items={provinces.map((province) => ({
        label: province.name,
        value: String(province.id),
      }))}
      value={selectedValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona una provincia" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px] overflow-y-auto">
        {provinces.map((province) => (
          <SelectItem key={province.id} value={String(province.id)}>
            {province.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
