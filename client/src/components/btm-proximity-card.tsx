import { MapPin, CheckCircle2, XCircle } from "lucide-react";
import { SiBitcoin } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BtmProximity } from "@shared/schema";

interface BtmProximityCardProps {
  data: BtmProximity;
  radiusMiles: number;
}

export function BtmProximityCard({ data, radiusMiles }: BtmProximityCardProps) {
  return (
    <Card className="p-6 space-y-4" data-testid="card-btm-proximity">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">BTM Proximity</h3>
            <p className="text-sm text-muted-foreground">Within {radiusMiles} mile radius</p>
          </div>
        </div>
        {data.meetsRequirement ? (
          <CheckCircle2 className="h-6 w-6 text-success" data-testid="icon-proximity-pass" />
        ) : (
          <XCircle className="h-6 w-6 text-error" data-testid="icon-proximity-fail" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <SiBitcoin className="h-6 w-6 text-primary" />
            <span className="font-medium">Bitcoin Depot ATMs</span>
          </div>
          <Badge
            variant={data.bitcoinDepotCount === 0 ? "default" : "destructive"}
            className="text-lg px-3 py-1 font-semibold"
            data-testid="badge-bd-count"
          >
            {data.bitcoinDepotCount}
          </Badge>
        </div>

        {data.competitors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Competitor ATMs</h4>
            <div className="grid gap-2">
              {data.competitors.map((competitor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  data-testid={`competitor-${index}`}
                >
                  <span className="text-sm font-medium">{competitor.name}</span>
                  <Badge variant="secondary" className="font-mono" data-testid={`badge-competitor-count-${index}`}>
                    {competitor.count}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Total Competitors</span>
              <span className="text-lg font-semibold font-mono" data-testid="text-total-competitors">
                {data.totalCompetitors}
              </span>
            </div>
          </div>
        )}

        {data.competitors.length === 0 && data.bitcoinDepotCount === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-success font-medium">
              ✓ No Bitcoin ATMs found within {radiusMiles} mile radius
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
