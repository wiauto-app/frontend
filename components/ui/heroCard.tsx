import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { IconContainer } from "./iconContainer";

interface HeroCardProps {
  title: string;
  description: string;
  content: React.ReactNode;
  iconName?: string;
  actionButton?: React.ReactNode;
}

export const HeroCard = ({ title, description, content,iconName,actionButton }: HeroCardProps) => {
  const Icon = resolveStrapiIconName(iconName);
  return (
    <Card>
      <CardHeader>
        <IconContainer Icon={Icon} />
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {actionButton && <CardFooter>{actionButton}</CardFooter>}
    </Card>
  );
};
