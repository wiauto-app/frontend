"use client";

import { RiSparklingFill } from "react-icons/ri";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AiSearchForm } from "./aiSearchForm";
import { SectionHeading } from "./SectionHeading";

export const WiautoMatchForm = () => {
  return (
    <section>
      <div className="rounded-xl bg-primary-dark shadow-lg ring-4 ring-primary/50">
        <Card size="sm" className="border-0 bg-transparent shadow-none ring-0">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <Badge>Nuevo</Badge>
              <span className="inline-flex" aria-hidden>
                <RiSparklingFill className="size-6 text-primary" />
              </span>
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
      </div>
    </section>
  );
};
