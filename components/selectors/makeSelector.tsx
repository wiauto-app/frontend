import { useQuery } from "@tanstack/react-query";
import { BaseSelect } from "../ui/baseSelect"
import { makeService } from "@/services/vehicles/makeService";

export const MakeSelector = () => {

  const { data: makes, isLoading } = useQuery({
    queryKey: ["makes"],
    queryFn: () => makeService.findAll(),
  });
  
  const items = Array.isArray(makes) ? makes : makes?.data ?? [];
  const options = items.map((make) => make.name);
  return (
    <BaseSelect label="Marca" options={options} isLoading={isLoading} />
  )
}
