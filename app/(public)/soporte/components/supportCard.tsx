import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  IconContainer,
  type AppIconComponent,
} from "@/components/ui/iconContainer";

interface SupportCardProps {
  Icon: AppIconComponent | null;
  title: string;
  description: string;
}

export const SupportCard = ({ Icon, title, description }: SupportCardProps) => {
  return (
    <Card  className="max-w-64 h-fit">
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {Icon ? <IconContainer size="xl" rounded Icon={Icon} /> : null}
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};
