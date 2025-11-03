import { Building2, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BusinessType } from "@shared/schema";

interface BusinessTypeCardProps {
  data: BusinessType;
}

export function BusinessTypeCard({ data }: BusinessTypeCardProps) {
  const getTierInfo = () => {
    if (data.tier === "tier1") {
      return { label: "Tier 1", color: "bg-chart-1/10 text-chart-1 border-chart-1/20", amount: "$300" };
    } else if (data.tier === "tier2") {
      return { label: "Tier 2", color: "bg-chart-2/10 text-chart-2 border-chart-2/20", amount: "$200" };
    }
    return { label: "Unqualified", color: "bg-muted text-muted-foreground border-muted", amount: null };
  };

  const tierInfo = getTierInfo();

  return (
    <Card className="p-6 space-y-4" data-testid="card-business-type">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Business Type</h3>
            <p className="text-sm text-muted-foreground">{data.category}</p>
          </div>
        </div>
        {data.meetsRequirement ? (
          <CheckCircle2 className="h-6 w-6 text-success" data-testid="icon-business-pass" />
        ) : (
          <XCircle className="h-6 w-6 text-error" data-testid="icon-business-fail" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Business Name</p>
          <p className="text-base font-medium" data-testid="text-business-name">{data.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Matched Type</p>
          <p className="text-base font-semibold font-mono" data-testid="text-matched-type">{data.matchedType}</p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-2">
            <Badge className={`${tierInfo.color} border`} data-testid="badge-tier">
              {tierInfo.label}
            </Badge>
            {tierInfo.amount && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="font-mono font-medium" data-testid="text-tier-amount">
                  {tierInfo.amount}
                </span>
              </div>
            )}
          </div>
        </div>

        {data.detectedTypes.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Detected Business Types</p>
            <div className="flex flex-wrap gap-2">
              {data.detectedTypes.map((type, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                  data-testid={`badge-detected-type-${index}`}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
