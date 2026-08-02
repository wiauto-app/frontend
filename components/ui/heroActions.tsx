import { StrapiLink } from "@/interfaces/strapi-components.interface";
import React from "react";
import { Button } from "./button";

export const HeroActions = ({ actions }: { actions: StrapiLink[] }) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.destacado ? "default" : "outline"}
          size="lg"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
