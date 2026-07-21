import { LucideIcon } from "lucide-react";

interface FilterItemProps {
  sectionId: string;
  title: string;
  children: React.ReactNode;
  Icon: React.ReactNode;
}

export const FilterItem = ({
  sectionId,
  title,
  children,
  Icon,
}: FilterItemProps) => {
  return (
    <div className=" py-2 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="text-primary">{Icon}</div>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
};
