"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/app/contexts/auth/useUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dealershipTeamService } from "@/services/dealerships/dealershipTeamService";
import { dealershipInvitationService } from "@/services/dealerships/dealershipInvitationService";
import type { DealershipMemberRole } from "@/services/dealerships/types/team.types";

import TeamTable from "./teamTable";
import RolesGrid from "./rolesGrid";
import { PendingInvitationsTable } from "./PendingInvitationsTable";
import { canManageTeam } from "../utils/teamPermissions";

export const EquipoContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoading: isUserLoading } = useUser();

  const membership = user?.dealership_membership;
  const dealershipId = membership?.dealership_id;
  const isManager = canManageTeam(membership?.role);

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
    if (!isUserLoading && !membership) {
      router.replace("/inicio");
    }
  }, [isUserLoading, membership, router]);

  useEffect(() => {
    if (searchParams.get("joined") === "1") {
      toast.success("Te uniste al equipo correctamente");
      router.replace("/equipo");
    }
  }, [router, searchParams]);

  const invalidateTeamQueries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["dealership-team", dealershipId] });
    await queryClient.invalidateQueries({ queryKey: ["dealership-invitations", dealershipId] });
    await queryClient.invalidateQueries({ queryKey: ["user"] });
  }, [dealershipId, queryClient]);

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
      router.replace("/inicio");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo salir del equipo",
      );
      throw error;
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      await dealershipInvitationService.revokeInvitation(invitationId);
      await refetchInvitations();
      toast.success("Invitación revocada");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo revocar la invitación",
      );
      throw error;
    }
  };

  if (isUserLoading || !membership) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">Cargando equipo...</p>
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
          <Link
            href="/invitar-miembro"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Invitar miembro
          </Link>
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
