import type {
  PressListItem,
  PressPaginatedResult,
} from "../types/press.types";
import { NewsPagination } from "../../noticias/components/NewsPagination";
import { PressCard } from "./PressCard";

type PressContentProps = {
  items: PressListItem[];
  pagination: PressPaginatedResult["pagination"];
};

export const PressContent = ({ items, pagination }: PressContentProps) => {
  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-slate-500">
        No hay artículos de prensa disponibles.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PressCard key={item.document_id} item={item} />
        ))}
      </div>

      <NewsPagination pagination={pagination} />
    </>
  );
};
