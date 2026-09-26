"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AiSearchForm } from "./aiSearchForm";
import { Badge } from "../ui/badge";
import { SectionHeading } from "./SectionHeading";
import { RiSparklingFill } from "react-icons/ri";

export const WiautoMatchForm = () => {
  return (
    <Card
      size="sm"
      className={cn("bg-primary-dark shadow-lg ring-4 ring-primary/50")}
    >
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Badge>Nuevo</Badge>
          <RiSparklingFill className="size-6 text-primary" />
          <CardTitle>
            <SectionHeading
              className="text-white text-2xl font-bold"
              lead="Wiauto Match"
            />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <AiSearchForm />
      </CardContent>
    </Card>
  );
};
