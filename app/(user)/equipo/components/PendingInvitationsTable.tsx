"use client";

import { Loader2, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { DealershipInvitation } from "@/services/dealerships/types/team.types";
import { getRoleLabel } from "../utils/teamPermissions";

type PendingInvitationsTableProps = {
  invitations: DealershipInvitation[];
  isLoading?: boolean;
  onRevoke: (invitationId: string) => Promise<void>;
};

const formatDate = (value: string): string => {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const PendingInvitationsTable = ({
  invitations,
  isLoading,
  onRevoke,
}: PendingInvitationsTableProps) => {
  const handleRevoke = async (invitation: DealershipInvitation) => {
    const confirmed = window.confirm(`¿Revocar la invitación a ${invitation.email}?`);
    if (!confirmed) {
      return;
    }

    try {
      await onRevoke(invitation.id);
      toast.success("Invitación revocada");
    } catch {
      toast.error("No se pudo revocar la invitación");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
        <Mail className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Sin invitaciones pendientes</h3>
        <p className="text-gray-500">Las invitaciones enviadas aparecerán aquí hasta que se acepten o revoquen.</p>
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
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Expira
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <tr key={invitation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{invitation.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {getRoleLabel(invitation.role)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(invitation.expires_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleRevoke(invitation)}
                    aria-label={`Revocar invitación a ${invitation.email}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
