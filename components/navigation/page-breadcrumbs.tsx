"use client";

import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/seo/breadcrumb.types";

type PageBreadcrumbsProps = {
  items: BreadcrumbItemType[];
  variant?: "default" | "onDark";
};

type RenderSegment = BreadcrumbItemType | "ellipsis";

const collapseItemsForMobile = (
  items: BreadcrumbItemType[],
): RenderSegment[] => {
  if (items.length <= 3) {
    return items;
  }

  return [items[0], "ellipsis", ...items.slice(-2)];
};

const variantClasses = {
  default: {
    list: "text-muted-foreground",
    link: "text-muted-foreground hover:text-foreground",
    page: "text-foreground",
    separator: "text-muted-foreground",
    ellipsis: "text-muted-foreground",
  },
  onDark: {
    list: "text-white/80",
    link: "text-white/80 hover:text-white",
    page: "text-white",
    separator: "text-white/60",
    ellipsis: "text-white/80",
  },
} as const;

type BreadcrumbTrailProps = {
  segments: RenderSegment[];
  variant: "default" | "onDark";
  className?: string;
};

const BreadcrumbTrail = ({
  segments,
  variant,
  className,
}: BreadcrumbTrailProps) => {
  const styles = variantClasses[variant];

  return (
    <BreadcrumbList className={cn(styles.list, className)}>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        if (segment === "ellipsis") {
          return (
            <Fragment key={`ellipsis-${index}`}>
              <BreadcrumbItem>
                <BreadcrumbEllipsis className={styles.ellipsis} />
              </BreadcrumbItem>
              {!isLast ? (
                <BreadcrumbSeparator className={styles.separator} />
              ) : null}
            </Fragment>
          );
        }

        return (
          <Fragment key={`${segment.label}-${index}`}>
            <BreadcrumbItem className="max-w-44">
              {segment.href ? (
                <BreadcrumbLink
                  render={<Link href={segment.href} />}
                  className={cn(styles.link, "truncate")}
                >
                  {segment.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className={cn(styles.page, "truncate")}>
                  {segment.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {!isLast ? (
              <BreadcrumbSeparator className={styles.separator} />
            ) : null}
          </Fragment>
        );
      })}
    </BreadcrumbList>
  );
};

export const PageBreadcrumbs = ({
  items,
  variant = "default",
}: PageBreadcrumbsProps) => {
  const mobileSegments = collapseItemsForMobile(items);

  return (
    <Breadcrumb aria-label="Breadcrumb">
      <BreadcrumbTrail
        segments={items}
        variant={variant}
        className="hidden sm:flex"
      />
      <BreadcrumbTrail
        segments={mobileSegments}
        variant={variant}
        className="flex sm:hidden"
      />
    </Breadcrumb>
  );
};
