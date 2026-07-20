import { PageSectionTitle } from "@/components/ui/pageSectionTitle";
import { SoporteCanales } from "../interfaces/soporte.interface";
import { ChannelCard } from "./channelCard";

export const Channels = ({ data }: { data: SoporteCanales | null }) => {
  if (!data) return null;
  return (
    <div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <PageSectionTitle title={data.header?.titulo ?? ""} description={data.header?.descripcion ?? ""} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.channel?.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
};
