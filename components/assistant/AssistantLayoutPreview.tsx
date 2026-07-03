import {
  ASSISTANT_STARTER_IDEAS,
  ASSISTANT_TRENDING_SEARCHES,
} from "@/components/assistant/constants/assistantSuggestions.constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartColumnIncreasing,
  MapIcon,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";

const PREVIEW_CONVERSATIONS = [
  "Toyota Corolla automático",
  "SUV familiar diésel",
  "Eléctrico en Madrid",
] as const;

export const AssistantLayoutPreview = () => {
  return (
    <div className="flex h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] overflow-hidden bg-background max-md:h-[calc(100dvh-7rem)] max-md:max-h-[calc(100dvh-7rem)]">
      <aside
        aria-hidden="true"
        className="hidden w-56 shrink-0 flex-col border-r bg-sidebar md:flex"
      >
        <div className="flex h-12 items-center gap-2 border-b px-4">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-semibold text-slate-900">Asistente</span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-3">
          <div>
            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
              Navegación
            </p>
            <ul className="space-y-1">
              {[
                { label: "Chat", Icon: MessageSquare, active: true },
                { label: "Búsqueda", Icon: Search, active: false },
                { label: "Mapa", Icon: MapIcon, active: false },
              ].map(({ label, Icon, active }) => (
                <li
                  key={label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-slate-700"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-h-0 flex-1">
            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
              Historial
            </p>
            <ul className="space-y-1">
              {PREVIEW_CONVERSATIONS.map((title) => (
                <li
                  key={title}
                  className="truncate rounded-md px-2 py-1.5 text-sm text-slate-600"
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <Skeleton className="size-8 rounded-md" />
          <span className="text-sm font-semibold text-slate-900">Asistente</span>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-2 sm:gap-4 sm:p-3 lg:grid-cols-12 lg:p-4">
          <Card
            size="sm"
            className="col-span-7 flex min-h-0 flex-1 flex-col overflow-hidden bg-white"
          >
            <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-3 pt-4 sm:px-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[80%] space-y-2 rounded-2xl bg-primary/10 px-4 py-3">
                  <Skeleton className="h-4 w-52 bg-primary/20" />
                  <Skeleton className="h-4 w-36 bg-primary/20" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="shrink-0 flex-col gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <p className="text-center text-[10px] text-muted-foreground sm:text-xs">
                <span className="font-bold text-primary">WiAuto AI</span> es una
                modelo para ayudar a los usuarios a encontrar vehículos de forma
                rápida y sencilla.
              </p>
            </CardFooter>
          </Card>

          <aside className="@container/panel col-span-5 hidden min-h-0 flex-col gap-3 overflow-y-auto p-1 sm:gap-4 sm:p-2 lg:flex">
            <Card size="sm" className="relative min-h-36 overflow-hidden sm:min-h-40">
              <CardHeader className="relative z-10 gap-1">
                <CardTitle className="text-base font-semibold text-white sm:text-lg">
                  Hola! 👋
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <div className="grid w-full grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                  {ASSISTANT_STARTER_IDEAS.slice(0, 4).map((item) => (
                    <div
                      key={item.prompt}
                      className="rounded-lg border bg-white/95 px-2.5 py-2 text-xs text-slate-900 sm:text-sm"
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </CardContent>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-br from-primary/80 via-primary/60 to-primary/40"
              />
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <ChartColumnIncreasing className="size-4 text-primary sm:size-5" />
                  Tendencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 gap-1.5 @sm/panel:grid-cols-2 sm:gap-2">
                  {ASSISTANT_TRENDING_SEARCHES.slice(0, 4).map((item) => (
                    <li
                      key={item.prompt}
                      className="rounded-lg border px-2.5 py-2.5 text-xs sm:py-3 sm:text-sm"
                    >
                      <p className="font-medium text-slate-900">{item.label}</p>
                      {item.description ? (
                        <p className="text-[10px] text-muted-foreground sm:text-xs">
                          {item.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};
