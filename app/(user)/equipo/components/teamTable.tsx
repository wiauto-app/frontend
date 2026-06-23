"use client";

import Link from "next/link";
import { Loader2, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  DealershipMemberDetail,
  DealershipMemberRole,
} from "@/services/dealerships/types/team.types";
import { canManageTeam, getRoleBadgeClass, getRoleLabel } from "../utils/teamPermissions";

type TeamTableProps = {
  members: DealershipMemberDetail[];
  currentMemberId?: string;
  currentRole?: DealershipMemberRole;
  isLoading?: boolean;
  onUpdateRole: (memberId: string, role: "admin" | "member") => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onLeaveTeam: () => Promise<void>;
};

const getMemberName = (member: DealershipMemberDetail): string => {
  const fullName = [member.profile.name, member.profile.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || member.profile.email;
};

const TeamTable = ({
  members,
  currentMemberId,
  currentRole,
  isLoading,
  onUpdateRole,
  onRemoveMember,
  onLeaveTeam,
}: TeamTableProps) => {
  const isManager = canManageTeam(currentRole);

  const handleRemove = async (member: DealershipMemberDetail) => {
    const confirmed = window.confirm(
      `¿Eliminar a ${getMemberName(member)} del equipo?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await onRemoveMember(member.id);
      toast.success("Miembro eliminado del equipo");
    } catch {
      toast.error("No se pudo eliminar al miembro");
    }
  };

  const handleLeave = async () => {
    const confirmed = window.confirm("¿Seguro que deseas salir del equipo?");
    if (!confirmed) {
      return;
    }

    try {
      await onLeaveTeam();
      toast.success("Has salido del equipo");
    } catch {
      toast.error("No se pudo completar la salida del equipo");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
        <UserX className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">No hay miembros</h3>
        <p className="mb-4 text-gray-500">Comienza invitando a tu primer miembro al equipo</p>
        {isManager ? (
          <Link
            href="/invitar-miembro"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Invitar miembro
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Miembro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rol
              </th>
              {isManager ? (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member) => {
              const isSelf = member.id === currentMemberId;
              const canEditMember =
                isManager && member.role !== "owner" && !isSelf;

              return (
                <tr key={member.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                        {getMemberName(member).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getMemberName(member)}</p>
                        <p className="text-sm text-gray-500">{member.profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {canEditMember ? (
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          onUpdateRole(member.id, value as "admin" | "member")
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="member">Miembro</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadgeClass(member.role)}`}
                      >
                        {getRoleLabel(member.role)}
                      </span>
                    )}
                  </td>
                  {isManager ? (
                    <td className="px-6 py-4 text-right">
                      {canEditMember ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRemove(member)}
                          aria-label={`Eliminar a ${getMemberName(member)}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isManager && currentRole === "member" ? (
        <div className="border-t border-gray-200 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={handleLeave}
          >
            Salir del equipo
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default TeamTable;
