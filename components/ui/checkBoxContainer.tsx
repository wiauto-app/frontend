export const CheckBoxContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-slate-600">{title}</h3>
      {children}
    </div>
  );
};
