import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const InvitationRoleSelector = ({
  onValueChange,
  value,
}: {
  onValueChange: (value: string) => void;
  value: string;
}) => {
  const roles = [
    {
      label: "Administrador",
      value: "admin",
    },
    {
      label: "Miembro",
      value: "member",
    },
  ];
  return (
    <Select items={roles} onValueChange={(value) => onValueChange(value ?? "")} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona un rol" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
