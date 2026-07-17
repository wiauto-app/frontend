import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type SimpleTooltipProps = {
  children: React.ReactNode;
  content: string | React.ReactNode;
};

export const SimpleTooltip = ({ children, content }: SimpleTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger render={<>{children}</>}></TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};
