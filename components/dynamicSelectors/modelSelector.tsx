import { useId } from "react";
import { SearchSelect } from "@/components/ui/searchSelect";
import { modelService } from "../vehicles/services/modelService";
import { Field, FieldLabel } from "@/components/ui/field";

export const ModelSelector = ({
  value,
  onChange,
  ariaInvalid,
  disabled,
  placeholder = "Modelo",
  makeId,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
  ariaInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  makeId?: number;
}) => {
  const fieldId = useId();

  const searchModels = async (query: string) => {
    if (!makeId) return [];
    const response = await modelService.findAll({
      limit: 100,
      page: 1,
      search: query,
      make_id: makeId,
    });
    const models = response.data ?? [];
    return models.map((model) => ({
      label: model.name,
      value: String(model.id),
    }));
  };

  return (
    <Field data-invalid={ariaInvalid}>
      <FieldLabel htmlFor={fieldId}>Modelo</FieldLabel>
      <SearchSelect
        id={fieldId}
        value={value}
        disabled={disabled || !makeId}
        onChange={(nextValue) => onChange?.(nextValue)}
        placeholder={placeholder ?? "Seleccionar modelo"}
        searchPlaceholder="Buscar modelo"
        searchFn={searchModels}
        resolveOption={async (modelId) => {
          const model = await modelService.findOne(Number(modelId));
          return { label: model.name, value: String(model.id) };
        }}
      />
    </Field>
  );
};
