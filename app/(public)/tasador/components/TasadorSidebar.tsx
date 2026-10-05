import { IconFeatureList } from "@/components/landings/IconFeatureList";
import { IconContainer } from "@/components/ui/iconContainer";
import type { StrapiCard, StrapiPlanesCaracteristicas } from "@/interfaces/strapi-components.interface";
import {
  resolveStrapiIconName,
  type StrapiIconPack,
} from "@/lib/strapi/resolveStrapiIconName";

interface TasadorSidebarProps {
  comoFunciona: StrapiPlanesCaracteristicas | null;
  avisoPrivacidad: StrapiCard | null;
  iconPack: StrapiIconPack;
}

/** "¿Cómo funciona?" y el aviso de privacidad junto al formulario. */
export const TasadorSidebar = ({ comoFunciona, avisoPrivacidad, iconPack }: TasadorSidebarProps) => {
  const PrivacyIcon = resolveStrapiIconName(avisoPrivacidad?.iconName, iconPack);

  return (
    <aside className="flex flex-col gap-5">
      {comoFunciona?.caracteristicas?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {comoFunciona.header?.titulo}
          </h2>
          <IconFeatureList
            items={comoFunciona.caracteristicas}
            iconPack={iconPack}
            variant="list"
            numbered
          />
        </section>
      ) : null}

      {avisoPrivacidad?.titulo ? (
        <section className="flex items-start gap-3 rounded-2xl bg-blue-50 p-5">
          <IconContainer Icon={PrivacyIcon} size="sm" justIcon className="text-primary" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-slate-900">{avisoPrivacidad.titulo}</p>
            {avisoPrivacidad.descripcion ? (
              <p className="text-sm text-slate-600">{avisoPrivacidad.descripcion}</p>
            ) : null}
          </div>
        </section>
      ) : null}
    </aside>
  );
};
