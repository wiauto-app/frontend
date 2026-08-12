import { Label } from "./label";

export const CheckBoxContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {title ? <Label className="text-sm font-medium text-slate-600">{title}</Label> : null}
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
};
