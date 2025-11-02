import { Users, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { PopulationDensity } from "@shared/schema";

interface PopulationDensityCardProps {
  data: PopulationDensity;
}

export function PopulationDensityCard({ data }: PopulationDensityCardProps) {
  const percentage = Math.min((data.density / data.threshold) * 100, 100);

  return (
    <Card className="p-6 space-y-4" data-testid="card-population-density">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Population Density</h3>
            <p className="text-sm text-muted-foreground">ZIP Code: <span className="font-mono">{data.zipCode}</span></p>
          </div>
        </div>
        {data.meetsRequirement ? (
          <CheckCircle2 className="h-6 w-6 text-success" data-testid="icon-density-pass" />
        ) : (
          <XCircle className="h-6 w-6 text-error" data-testid="icon-density-fail" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Total Population</span>
          <span className="text-lg font-semibold font-mono" data-testid="text-population-value">
            {data.population.toLocaleString()}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Population Density</span>
          <span className="text-2xl font-semibold font-mono" data-testid="text-density-value">
            {data.density.toLocaleString()} <span className="text-sm text-muted-foreground">/sq mi</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Required Minimum</span>
          <span className="text-lg font-medium font-mono text-muted-foreground" data-testid="text-density-threshold">
            {data.threshold.toLocaleString()}
          </span>
        </div>

        <div className="space-y-2 pt-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                data.meetsRequirement ? "bg-success" : "bg-error"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {data.meetsRequirement
              ? `${((data.density / data.threshold - 1) * 100).toFixed(0)}% above minimum requirement`
              : `${((1 - data.density / data.threshold) * 100).toFixed(0)}% below minimum requirement`}
          </p>
        </div>
      </div>
    </Card>
  );
}
