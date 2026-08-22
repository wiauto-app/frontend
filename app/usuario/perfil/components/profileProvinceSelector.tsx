import { InputSkeleton } from "@/components/ui/inputSkeleton";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
    <NativeSelect
      className="w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <NativeSelectOption value="">Selecciona una provincia</NativeSelectOption>
      {provinces.map((province) => (
        <NativeSelectOption key={province.id} value={province.id}>
          {province.name}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
};
