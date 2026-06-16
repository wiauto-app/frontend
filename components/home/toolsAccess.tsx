import { ToolCard } from "./toolCard"
import { StrapiCard } from "./types/home-page.types"

export const ToolsAccess = ({ data }: { data: StrapiCard[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
      {data.map((item) => (
        <ToolCard key={item.titulo} item={item} />
      ))}
    </div>
  )
}
