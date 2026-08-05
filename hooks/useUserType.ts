"use client"
import { useUser } from "@/app/contexts/auth/useUser";

export const useUserType = () => {

  const {user} = useUser();

  return {
    isParticular: user?.userType === "particular",
    isProfessional: user?.userType === "professional",
    userType: user?.userType,
  };
}