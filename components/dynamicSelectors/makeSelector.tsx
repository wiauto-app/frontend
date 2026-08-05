import { useId } from "react";
import { makesService } from "@/components/vehicles/services/makesService";
import { SearchSelect } from "@/components/ui/searchSelect";
import { Field, FieldLabel } from "@/components/ui/field";

export const MakeSelector = ({
  value,
  onChange,
  ariaInvalid,
  disabled,
  placeholder = "Marca",
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
  ariaInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) => {
  const fieldId = useId();

  const searchMakes = async (query: string) => {
    const response = await makesService.findAll({
      limit: 100,
      page: 1,
      search: query,
    });

    const makes = response.data ?? [];

    return makes.map((make) => ({
      label: make.name,
      value: String(make.id),
    }));
  };

  return (
    <Field data-invalid={ariaInvalid}>
      <FieldLabel htmlFor={fieldId}>Marca</FieldLabel>
      <SearchSelect
        id={fieldId}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        searchPlaceholder="Buscar marca..."
        emptyText="No se encontraron marcas"
        searchFn={searchMakes}
        resolveOption={async (makeId) => {
          const make = await makesService.findOne(Number(makeId));
          return { label: make.name, value: String(make.id) };
        }}
        onChange={(nextValue) => onChange?.(nextValue)}
      />
    </Field>
  );
};
