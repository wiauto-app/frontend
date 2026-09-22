import { AlertTriangle, Inbox, SearchX, type LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const emptyContentMediaVariants = cva(
  "flex size-14 shrink-0 items-center justify-center rounded-full [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        "no-data": "bg-muted text-muted-foreground",
        "no-results": "bg-muted text-muted-foreground",
        error:
          "bg-destructive/10 text-destructive dark:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "no-data",
    },
  }
)

type EmptyContentVariant = NonNullable<
  VariantProps<typeof emptyContentMediaVariants>["variant"]
>

const DEFAULT_EMPTY_CONTENT_ICON: Record<EmptyContentVariant, LucideIcon> = {
  "no-data": Inbox,
  "no-results": SearchX,
  error: AlertTriangle,
}

interface EmptyContentProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof emptyContentMediaVariants> {
  /** Lucide icon rendered inside the default circular media. Ignored when `media` is set. */
  icon?: LucideIcon
  /** Fully custom illustration/media node. Overrides `icon` and the default circle treatment. */
  media?: React.ReactNode
  /** Extra classes for the default icon circle (ignored when `media` is set). */
  mediaClassName?: string
  /** Heading content. Keep it short — this is the scanning anchor for the state. */
  title: React.ReactNode
  /** Optional supporting copy. One or two sentences, explains what happened or what to do next. */
  description?: React.ReactNode
  /** Heading tag used for `title`, so this nests correctly under the surrounding page outline. */
  titleAs?: "h2" | "h3" | "h4"
  /** Primary call to action, e.g. a `<Button>Crear anuncio</Button>`. */
  action?: React.ReactNode
  /** Secondary, lower-emphasis action, e.g. a `<Button variant="ghost">`. */
  secondaryAction?: React.ReactNode
  /**
   * Marks this region as a polite live region, for empty states that can appear
   * asynchronously in place of existing content (search, filters). The `error`
   * variant is always announced (`role="alert"`) regardless of this flag.
   */
  live?: boolean
}

function EmptyContent({
  variant = "no-data",
  icon: Icon,
  media,
  mediaClassName,
  title,
  description,
  titleAs: TitleTag = "h3",
  action,
  secondaryAction,
  live = false,
  className,
  ...props
}: EmptyContentProps) {
  const resolvedVariant = variant ?? "no-data"
  const ResolvedIcon = Icon ?? DEFAULT_EMPTY_CONTENT_ICON[resolvedVariant]
  const role = resolvedVariant === "error" ? "alert" : live ? "status" : undefined
  const ariaLive =
    resolvedVariant === "error" ? "assertive" : live ? "polite" : undefined

  return (
    <div
      data-slot="empty-content"
      data-variant={resolvedVariant}
      role={role}
      aria-live={ariaLive}
      className={cn(
        "flex w-full flex-col items-center gap-4 px-6 py-12 text-center sm:py-16",
        "animate-in fade-in-0 zoom-in-95 duration-300 ease-out",
        className
      )}
      {...props}
    >
      {media ?? (
        <div
          data-slot="empty-content-media"
          className={cn(
            emptyContentMediaVariants({ variant: resolvedVariant }),
            mediaClassName
          )}
        >
          <ResolvedIcon aria-hidden="true" />
        </div>
      )}

      <div className="flex max-w-md flex-col gap-1.5">
        <TitleTag
          data-slot="empty-content-title"
          className="text-balance font-heading text-base font-semibold text-foreground"
        >
          {title}
        </TitleTag>

        {description ? (
          <p
            data-slot="empty-content-description"
            className="text-pretty text-sm leading-6 text-muted-foreground"
          >
            {description}
          </p>
        ) : null}
      </div>

      {action || secondaryAction ? (
        <div
          data-slot="empty-content-actions"
          className="mt-1 flex flex-wrap items-center justify-center gap-2"
        >
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  )
}

export { EmptyContent, emptyContentMediaVariants, type EmptyContentProps, type EmptyContentVariant }
