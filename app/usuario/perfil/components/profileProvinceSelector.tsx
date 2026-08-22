import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { provincesCatalogService } from "@/services/locations/provincesCatalogService";
import { useQuery } from "@tanstack/react-query";

export const ProfileProvinceSelector = () => {
  const { data } = useQuery({
    queryKey: ["profile-province-selector"],
    queryFn: () => provincesCatalogService.findAll({ page: 1, limit: 100 }),
  });
  console.log(data);
  return (
    <NativeSelect>
      <NativeSelectOption></NativeSelectOption>
    </NativeSelect>
  );
};
