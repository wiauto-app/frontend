"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { useChatFilters } from "@/components/chat/hooks/useChatFilters";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/interfaces/profile.interface";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { chatService, unwrapChatResponse } from "@/services/chatService";
import { profileService } from "@/services/profileService";

export const CreateChatDialog = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { handleChange } = useChatFilters();

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [vehicleId, setVehicleId] = useState("");

  const debouncedSearch = useDebouncedValue(searchValue.trim(), 300);

  const profilesQuery = useQuery({
    queryKey: ["chat-create-profiles", debouncedSearch],
    enabled: isOpen,
    queryFn: async () => {
      const filter = debouncedSearch.includes("@")
        ? {
            page: 1,
            limit: 20,
            email: debouncedSearch || undefined,
          }
        : {
            page: 1,
            limit: 20,
            name: debouncedSearch || undefined,
          };

      const response = await profileService.getProfiles(filter);
      return response?.data ?? [];
    },
  });

  const profiles = useMemo(
    () =>
      (profilesQuery.data ?? []).filter((profile) => profile.id !== user?.id),
    [profilesQuery.data, user?.id],
  );

  const selectedProfile = useMemo(
    () =>
      profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId],
  );

  const createChatMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProfileId) {
        throw new Error("Debes seleccionar un usuario.");
      }

      return unwrapChatResponse(
        await chatService.create({
          participants: [selectedProfileId],
          vehicle_id: vehicleId.trim() || null,
        }),
      );
    },
    onSuccess: async (chat) => {
      toast.success("Chat creado correctamente.");
      handleChange("chat_id", chat.id);
      await queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      setIsOpen(false);
      setSearchValue("");
      setSelectedProfileId(null);
      setVehicleId("");
    },
    onError: () => {
      toast.error("No se pudo crear el chat.");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button size="icon" aria-label="Crear chat">
            <PlusIcon className="size-4" />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear chat</DialogTitle>
          <DialogDescription>
            Busca un usuario por nombre o email, selecciónalo y crea el chat.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <Input
            placeholder="ID del vehículo (UUID, opcional)"
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
          />

          <div className="max-h-72 overflow-y-auto rounded-md border">
            {profilesQuery.isLoading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={`profile-skeleton-${index}`}
                    className="h-12 w-full"
                  />
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No hay perfiles para mostrar.
              </p>
            ) : (
              <div className="flex flex-col">
                {profiles.map((profile: Profile) => {
                  const isSelected = selectedProfileId === profile.id;
                  const fullName =
                    `${profile.name ?? ""} ${profile.last_name ?? ""}`.trim();
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      className={`border-b p-3 text-left last:border-b-0 ${
                        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedProfileId(profile.id)}
                    >
                      <p className="text-sm font-medium">
                        {fullName || "Sin nombre"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile.user.email}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedProfile ? (
            <p className="text-xs text-muted-foreground">
              Seleccionado:{" "}
              <span className="font-medium text-foreground">
                {`${selectedProfile.name ?? ""} ${selectedProfile.last_name ?? ""}`.trim() ||
                  selectedProfile.user.email}
              </span>
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            onClick={() => createChatMutation.mutate()}
            disabled={createChatMutation.isPending || !selectedProfileId}
          >
            Crear chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
