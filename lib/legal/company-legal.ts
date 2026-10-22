/** Datos identificativos publicados en el aviso legal (LSSI). */
export interface CompanyLegalInfo {
  legalName: string;
  legalForm: string;
  nif: string;
  address: string;
  email: string;
  phone: string;
  mercantileRegistry: string;
  mercantileRegistryEntry: string;
}

export const COMPANY_LEGAL: CompanyLegalInfo = {
  legalName: "WIAUTO MOTOR DIGITAL S.L.",
  legalForm: "Sociedad Limitada",
  nif: "B05580931",
  address: "Paseo Constitución 8, 50008 Zaragoza (España)",
  email: "contacto@wiauto.es",
  phone: "+34 876 21 24 06",
  mercantileRegistry: "Registro Mercantil de Zaragoza",
  mercantileRegistryEntry:
    "Hoja Z-78815, Tomo 8, Folio 0, Inscripción 1ª (10 de septiembre de 2026)",
};
