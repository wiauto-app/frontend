import { useId } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { SearchSelect } from "@/components/ui/searchSelect";
import { provincesCatalogService } from "@/services/locations/provincesCatalogService";

interface ContactProvinceSelectProps {
  value?: string;
  onChange: (provinceId: number, provinceName: string) => void;
  ariaInvalid?: boolean;
  disabled?: boolean;
}

export const ContactProvinceSelect = ({
  value,
  onChange,
  ariaInvalid,
  disabled,
}: ContactProvinceSelectProps) => {
  const fieldId = useId();

  const searchProvinces = async (query: string) => {
    const response = await provincesCatalogService.findAll({
      limit: 100,
      page: 1,
      search: query,
      order_by: "name",
      order_direction: "ASC",
    });

    return response.data.map((province) => ({
      label: province.name,
      value: String(province.id),
    }));
  };

  return (
    <Field data-invalid={ariaInvalid}>
      <FieldLabel htmlFor={fieldId}>Provincia</FieldLabel>
      <SearchSelect
        id={fieldId}
        value={value}
        disabled={disabled}
        placeholder="Selecciona tu provincia"
        searchPlaceholder="Buscar provincia..."
        emptyText="No se encontraron provincias"
        searchFn={searchProvinces}
        onChange={(nextValue, option) => onChange(Number(nextValue), option.label)}
      />
    </Field>
  );
};
