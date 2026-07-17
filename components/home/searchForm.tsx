"use client";

import { HeroSearchForm } from "./HeroSearchForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AiSearchForm } from "./aiSearchForm";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { SparklesIcon } from "lucide-react";

export const SearchForm = () => {
  const [activeTab, setActiveTab] = useState<"search-ai" | "search-filters">(
    "search-ai",
  );
  return (
    <Card
      size="sm"
      className={cn(
        activeTab === "search-ai" &&
          "bg-primary shadow-lg ring-4 ring-primary/50",
      )}
    >
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="search-ai">
              <div className="flex items-center gap-2">
                <Badge>Nuevo</Badge>
                <span className="flex items-center gap-2  font-bold text-primary">
                  <SparklesIcon className="size-5" />
                  Buscar con IA
                </span>
              </div>
            </TabsTrigger>
            {/* <TabsTrigger value="search-filters">
              Filtros
              <FilterIcon className="size-5" />
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="search-ai">
            <AiSearchForm />
          </TabsContent>
          {/* <TabsContent value="search-filters">
            <HeroSearchForm />
          </TabsContent> */}
        </Tabs>
      </CardContent>
    </Card>
  );
};
