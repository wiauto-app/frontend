"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { dealershipTeamService } from "@/services/dealerships/dealershipTeamService";
import { dealershipInvitationService } from "@/services/dealerships/dealershipInvitationService";
import type { DealershipMemberRole } from "@/services/dealerships/types/team.types";

import TeamTable from "./teamTable";
import RolesGrid from "./rolesGrid";
import { PendingInvitationsTable } from "./PendingInvitationsTable";
import { canManageTeam } from "../utils/teamPermissions";
import { InviteUserDialog } from "./inviteUserDialog";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const EquipoContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoading: isUserLoading, refreshUser, logout } = useUser();
  const hasShownJoinSuccess = useRef(false);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

  const invitationIdParam = searchParams.get("invitation");
  const invitationId =
    invitationIdParam && UUID_REGEX.test(invitationIdParam)
      ? invitationIdParam
      : null;

  const membership = user?.dealership_membership;
  const dealershipId = membership?.dealership_id;
  const isManager = canManageTeam(membership?.role);

  const {
    data: joinStatus,
    isLoading: isJoinStatusLoading,
    isError: isJoinStatusError,
    error: joinStatusError,
  } = useQuery({
    queryKey: ["dealership-invitation-join-status", invitationId],
    queryFn: () => dealershipInvitationService.getJoinStatus(invitationId!),
    enabled: Boolean(invitationId) && !isUserLoading && Boolean(user),
    retry: false,
  });

  const {
    data: members = [],
    isLoading: isTeamLoading,
  } = useQuery({
    queryKey: ["dealership-team", dealershipId],
    queryFn: () => dealershipTeamService.getTeam(dealershipId!),
    enabled: Boolean(dealershipId),
  });

  const {
    data: invitationsResult,
    isLoading: isInvitationsLoading,
    refetch: refetchInvitations,
  } = useQuery({
    queryKey: ["dealership-invitations", dealershipId],
    queryFn: () =>
      dealershipInvitationService.listInvitations({
        dealership_id: dealershipId!,
        status: "pending",
      }),
    enabled: Boolean(dealershipId) && isManager,
  });

  const membersByRole = useMemo(
    () =>
      members.reduce<Record<DealershipMemberRole, number>>(
        (acc, member) => {
          acc[member.role] += 1;
          return acc;
        },
        { owner: 0, admin: 0, member: 0 },
      ),
    [members],
  );

  useEffect(() => {
    if (!joinStatus?.belongs_to_current_user || hasShownJoinSuccess.current) {
      return;
    }

    hasShownJoinSuccess.current = true;

    const finalizeJoin = async () => {
      await refreshUser();
      await queryClient.invalidateQueries({ queryKey: ["dealership-team"] });
      toast.success("Te uniste al equipo correctamente");
      router.replace("/usuario/equipo");
    };

    void finalizeJoin();
  }, [joinStatus, queryClient, refreshUser, router]);

  const invalidateTeamQueries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["dealership-team", dealershipId] });
    await queryClient.invalidateQueries({ queryKey: ["dealership-invitations", dealershipId] });
    await refreshUser();
  }, [dealershipId, queryClient, refreshUser]);

  const handleUpdateRole = async (memberId: string, role: "admin" | "member") => {
    if (!dealershipId) {
      return;
    }

    try {
      await dealershipTeamService.updateMemberRole(dealershipId, memberId, { role });
      await invalidateTeamQueries();
      toast.success("Rol actualizado");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo actualizar el rol",
      );
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!dealershipId) {
      return;
    }

    try {
      await dealershipTeamService.removeMember(dealershipId, memberId);
      await invalidateTeamQueries();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar al miembro",
      );
      throw error;
    }
  };

  const handleLeaveTeam = async () => {
    if (!dealershipId) {
      return;
    }

    try {
      await dealershipTeamService.leaveTeam(dealershipId);
      await invalidateTeamQueries();
      router.replace("/usuario/inicio");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo salir del equipo",
      );
      throw error;
    }
  };

  const handleRevokeInvitation = async (invitationIdToRevoke: string) => {
    try {
      await dealershipInvitationService.revokeInvitation(invitationIdToRevoke);
      await refetchInvitations();
      toast.success("Invitación revocada");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo revocar la invitación",
      );
      throw error;
    }
  };

  const handleSwitchAccount = async () => {
    if (!invitationId) {
      return;
    }

    setIsSwitchingAccount(true);
    const returnPath = `/usuario/equipo?invitation=${encodeURIComponent(invitationId)}`;

    try {
      await logout();
      router.replace(
        `${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(returnPath)}`,
      );
    } catch {
      toast.error("No se pudo cerrar la sesión");
      setIsSwitchingAccount(false);
    }
  };

  if (isUserLoading || (invitationId && isJoinStatusLoading)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">Cargando equipo...</p>
      </div>
    );
  }

  if (invitationId && isJoinStatusError) {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 p-6"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-red-900">
              Invitación no válida
            </h2>
            <p className="text-sm text-red-800">
              {joinStatusError instanceof Error
                ? joinStatusError.message
                : "No se pudo validar esta invitación. Puede haber caducado o haberse revocado."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (invitationId && joinStatus && !joinStatus.belongs_to_current_user) {
    return (
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 p-6"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-amber-950">
                Esta invitación no corresponde a tu cuenta
              </h2>
              <p className="text-sm text-amber-900">
                La invitación para unirte a{" "}
                <span className="font-medium">
                  {joinStatus.dealership_name || "este equipo"}
                </span>{" "}
                se envió a{" "}
                <span className="font-medium">{joinStatus.invited_email}</span>,
                pero has iniciado sesión como{" "}
                <span className="font-medium">
                  {joinStatus.current_user_email}
                </span>
                .
              </p>
            </div>
            <Button
              type="button"
              onClick={handleSwitchAccount}
              disabled={isSwitchingAccount}
              aria-label="Cerrar sesión e iniciar con la cuenta invitada"
            >
              {isSwitchingAccount
                ? "Cerrando sesión..."
                : "Cerrar sesión e iniciar con esa cuenta"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">
          {invitationId
            ? "Cargando equipo..."
            : "No perteneces a ningún equipo."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          </div>
          <p className="text-sm text-gray-500">{membership.dealership_name}</p>
        </div>
        {isManager ? (
          <InviteUserDialog />
        ) : null}
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          {isManager ? (
            <TabsTrigger value="invitations">Invitaciones pendientes</TabsTrigger>
          ) : null}
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <TeamTable
            members={members}
            currentMemberId={membership.member_id}
            currentRole={membership.role}
            isLoading={isTeamLoading}
            onUpdateRole={handleUpdateRole}
            onRemoveMember={handleRemoveMember}
            onLeaveTeam={handleLeaveTeam}
          />
          <RolesGrid membersByRole={membersByRole} />
        </TabsContent>

        {isManager ? (
          <TabsContent value="invitations">
            <PendingInvitationsTable
              invitations={invitationsResult?.data ?? []}
              isLoading={isInvitationsLoading}
              onRevoke={handleRevokeInvitation}
            />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  );
};
