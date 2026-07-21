import { Label } from "./label";

export const CheckBoxContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-slate-600">{title}</Label>
      {children}
    </div>
  );
};
