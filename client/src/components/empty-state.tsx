import { MapPin, TrendingUp, Building2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState() {
  return (
    <div className="text-center py-16 space-y-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Enter an address to get started
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Instantly qualify any retail location for Bitcoin ATM placement with automated checks for all requirements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 max-w-4xl mx-auto">
        {[
          { icon: TrendingUp, label: "Population Density", desc: "ZIP code analysis" },
          { icon: MapPin, label: "BTM Proximity", desc: "1-mile radius search" },
          { icon: Building2, label: "Business Type", desc: "Tier classification" },
          { icon: Clock, label: "Store Hours", desc: "Operating schedule" },
        ].map((item, index) => (
          <Card key={index} className="p-4 space-y-2 text-center hover-elevate">
            <div className="flex justify-center">
              <div className="rounded-lg bg-muted p-2">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <h3 className="font-medium text-sm">{item.label}</h3>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
