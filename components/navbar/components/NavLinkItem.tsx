"use client";

import Link from "next/link";

import {
  BRAND_BLUE,
  type NavLink,
  type NavLinkGroup,
} from "../constants/navLinks.constants";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  getNavLinkItemClassName,
  type NavLinkVariant,
} from "./getNavLinkItemClassName";
import { IconContainer } from "@/components/ui/iconContainer";
import { cn } from "@/lib/utils";

interface NavLinkItemProps {
  href?: string;
  label: string;
  items?: NavLink[];
  itemsGroups?: NavLinkGroup[];
  isActive: boolean;
  variant: NavLinkVariant;
  onNavigate?: () => void;
}

interface NavLinkRowProps {
  item: NavLink;
  variant: NavLinkVariant;
  onNavigate?: () => void;
}

const NavLinkRow = ({ item, variant, onNavigate }: NavLinkRowProps) => {
  if (!item.href) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-md px-1 py-2 text-sm text-slate-700 transition-colors hover:text-[#0061F2]"
      >
        {item.Icon ? <IconContainer Icon={item.Icon} size="xs" /> : null}
        <span>
          <span className="block font-medium">{item.label}</span>
          {item.description ? (
            <span className="block text-xs text-muted-foreground">
              {item.description}
            </span>
          ) : null}
        </span>
      </Link>
    );
  }

  return (
    <NavigationMenuLink
      closeOnClick
      render={<Link href={item.href} onClick={onNavigate} />}
      className="flex items-center gap-3 rounded-md p-2"
    >
      {item.Icon ? <IconContainer Icon={item.Icon} size="md" /> : null}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">{item.label}</span>
        {item.description ? (
          <span className="text-xs text-muted-foreground">
            {item.description}
          </span>
        ) : null}
      </span>
    </NavigationMenuLink>
  );
};

const NavLinkItemsList = ({
  items,
  variant,
  onNavigate,
}: {
  items: NavLink[];
  variant: NavLinkVariant;
  onNavigate?: () => void;
}) => {
  return (
    <ul className="flex flex-col gap-0">
      {items.map((item) => {
        if (!item.href) {
          return null;
        }

        return (
          <li key={`${item.href}-${item.label}`}>
            <NavLinkRow item={item} variant={variant} onNavigate={onNavigate} />
          </li>
        );
      })}
    </ul>
  );
};

const NavLinkGroups = ({
  itemsGroups,
  variant,
  onNavigate,
}: {
  itemsGroups: NavLinkGroup[];
  variant: NavLinkVariant;
  onNavigate?: () => void;
}) => {
  const renderGroupLabel = (group: NavLinkGroup) => {
    const GroupIcon = group.Icon;

    return (
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs font-semibold uppercase  text-primary",
          variant === "mobile" ? "px-1 pb-1" : "px-2 pb-2",
        )}
      >
        {GroupIcon ? (
          <GroupIcon className="size-3.5 shrink-0" aria-hidden />
        ) : null}
        {group.label}
      </p>
    );
  };

  if (variant === "mobile") {
    return (
      <div className="mb-2 flex flex-col gap-3 pb-2">
        {itemsGroups.map((group) => (
          <div key={group.label}>
            {renderGroupLabel(group)}
            <NavLinkItemsList
              items={group.items}
              variant={variant}
              onNavigate={onNavigate}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4 p-1",
        itemsGroups.length > 1 ? "min-w-md grid-cols-2" : "min-w-80 grid-cols-1",
      )}
    >
      {itemsGroups.map((group) => (
        <div key={group.label} className="min-w-0">
          {renderGroupLabel(group)}
          <NavLinkItemsList
            items={group.items}
            variant={variant}
            onNavigate={onNavigate}
          />
        </div>
      ))}
    </div>
  );
};

export const NavLinkItem = ({
  href,
  label,
  isActive,
  variant,
  onNavigate,
  items,
  itemsGroups,
}: NavLinkItemProps) => {
  const handleClick = () => {
    onNavigate?.();
  };

  const hasGroups = Boolean(itemsGroups?.length);
  const hasItems = Boolean(items?.length);

  if (hasGroups || hasItems) {
    if (variant === "mobile") {
      return (
        <div className="border-b border-slate-100">
          <p className="px-1 py-3 text-base font-semibold text-slate-900">
            {label}
          </p>
          {hasGroups ? (
            <NavLinkGroups
              itemsGroups={itemsGroups!}
              variant={variant}
              onNavigate={handleClick}
            />
          ) : (
            <div className="mb-2 pb-2">
              <NavLinkItemsList
                items={items!}
                variant={variant}
                onNavigate={handleClick}
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger
          className={cn(
            getNavLinkItemClassName(variant, isActive),
            "h-auto rounded-none bg-transparent px-0 py-0 shadow-none hover:bg-transparent focus:bg-transparent focus-visible:ring-0 data-open:bg-transparent data-popup-open:bg-transparent",
          )}
          style={isActive ? { color: BRAND_BLUE } : undefined}
        >
          {label}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="p-2">
          {hasGroups ? (
            <NavLinkGroups
              itemsGroups={itemsGroups!}
              variant={variant}
              onNavigate={handleClick}
            />
          ) : (
            <div className="min-w-80">
              <NavLinkItemsList
                items={items!}
                variant={variant}
                onNavigate={handleClick}
              />
            </div>
          )}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  if (!href) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={getNavLinkItemClassName(variant, isActive)}
        style={isActive ? { color: BRAND_BLUE } : undefined}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        render={<Link href={href} />}
        className={cn(
          getNavLinkItemClassName(variant, isActive),
          "bg-transparent px-0 py-0 hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent",
        )}
        style={isActive ? { color: BRAND_BLUE } : undefined}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};
