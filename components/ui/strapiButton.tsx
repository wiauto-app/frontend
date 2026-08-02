import { StrapiLink } from "@/interfaces/strapi-components.interface";
import Link from "next/link";
import { Button } from "./button";

export const StrapiButton = ({ button }: { button: StrapiLink }) => {
  return (
    <Link href={button.url}>
      <Button variant={button.destacado ? "default" : "outline"} size="lg">
        {button.label}
      </Button>
    </Link>
  );
};
