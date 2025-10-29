import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SearchInput } from "@/components/search-input";
import { QualificationSummary } from "@/components/qualification-summary";
import { PopulationDensityCard } from "@/components/population-density-card";
import { BtmProximityCard } from "@/components/btm-proximity-card";
import { BusinessTypeCard } from "@/components/business-type-card";
import { StoreHoursCard } from "@/components/store-hours-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import type { QualificationResult, Settings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [result, setResult] = useState<QualificationResult | null>(null);
  const { toast } = useToast();

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const qualifyMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await apiRequest("POST", "/api/qualify", { address });
      return await response.json() as QualificationResult;
    },
    onSuccess: (data) => {
      setResult(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message || "Unable to analyze this address. Please check the address and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (address: string) => {
    qualifyMutation.mutate(address);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[75rem] mx-auto px-4 py-12 space-y-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Location Qualification Tool
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Instantly determine if a retail location qualifies for Bitcoin ATM placement
            </p>
          </div>

          <SearchInput
            onSearch={handleSearch}
            isLoading={qualifyMutation.isPending}
          />
        </div>

        <div id="results">
          {qualifyMutation.isPending && <LoadingSkeleton />}

          {!qualifyMutation.isPending && !result && <EmptyState />}

          {!qualifyMutation.isPending && result && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-muted-foreground">Results for:</h2>
                <p className="text-xl font-semibold font-mono" data-testid="text-analyzed-address">
                  {result.formattedAddress}
                </p>
              </div>

              <QualificationSummary
                qualified={result.qualified}
                summary={result.summary}
              />

              <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
                <StoreHoursCard data={result.storeHours} />
                <BtmProximityCard
                  data={result.btmProximity}
                  radiusMiles={settings?.searchRadiusMiles ?? 1}
                />
                <div className="space-y-6">
                  <PopulationDensityCard data={result.populationDensity} />
                  <BusinessTypeCard data={result.businessType} />
                </div>
              </div>

              <div className="text-center pt-8">
                <p className="text-sm text-muted-foreground">
                  Analyzed on {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
