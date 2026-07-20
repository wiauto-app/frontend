import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { FaStoreAlt } from "react-icons/fa";
import { LuStore } from "react-icons/lu";

export const NavbarDealership = () => {
  const { user } = useUser();
  console.log(user);
  if (!user) return null;

  if (!user.dealership_membership) return null;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            size="lg"
            variant="outline"
            className="flex items-center gap-2 justify-start"
          >
            <LuStore className="size-5" />
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">
                {user.dealership_membership.dealership_name}
              </p>
             <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-green-500"></div>
             <p className="text-xs text-muted-foreground">
                {user.dealership_membership.role}
              </p>
             </div>
            </div>
            <ChevronDown className="size-5" />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent side="bottom" align="end">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            {user.dealership_membership.dealership_name}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
