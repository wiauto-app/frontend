"use client";

/**
 * @deprecated Preferir `useEntitlements`. Los tipos de cuenta ya no existen.
 * Se mantiene como stub vacío para no romper imports residuales.
 */
export const useUserType = () => {
  return {
    isParticular: true,
    isProfessional: false,
    userType: undefined as undefined,
  };
};
