"use client";

import { ShieldHalf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DealershipMemberRole } from "@/services/dealerships/types/team.types";
import { getRoleLabel } from "../utils/teamPermissions";

type RoleInfo = {
  role: DealershipMemberRole;
  description: string;
  permissions: string[];
  memberCount: number;
};

const DEFAULT_ROLES: Omit<RoleInfo, "memberCount">[] = [
  {
    role: "owner",
    description: "Control total del concesionario y del equipo.",
    permissions: ["Gestionar equipo", "Invitar miembros", "Configuración"],
  },
  {
    role: "admin",
    description: "Gestiona miembros e invitaciones del equipo.",
    permissions: ["Gestionar equipo", "Invitar miembros"],
  },
  {
    role: "member",
    description: "Accede al área profesional del concesionario.",
    permissions: ["Ver equipo", "Salir del equipo"],
  },
];

type RolesGridProps = {
  membersByRole: Record<DealershipMemberRole, number>;
};

const RolesGrid = ({ membersByRole }: RolesGridProps) => {
  const roles: RoleInfo[] = DEFAULT_ROLES.map((role) => ({
    ...role,
    memberCount: membersByRole[role.role] ?? 0,
  }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-gray-900">Roles del equipo</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.role} className="overflow-hidden bg-blue-50/40">
            <CardContent className="px-4 py-4">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2">
                    <ShieldHalf className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{getRoleLabel(role.role)}</h3>
                    <p className="text-sm text-gray-500">{role.memberCount} miembros</p>
                  </div>
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-600">{role.description}</p>

              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-md bg-white px-2 py-1 text-xs text-gray-700"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolesGrid;





