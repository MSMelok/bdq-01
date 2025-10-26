import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { StoreHours } from "@shared/schema";

interface StoreHoursCardProps {
  data: StoreHours;
}

export function StoreHoursCard({ data }: StoreHoursCardProps) {
  return (
    <Card className="p-6 space-y-4" data-testid="card-store-hours">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Store Hours</h3>
            <p className="text-sm text-muted-foreground">Operating schedule</p>
          </div>
        </div>
        {data.meetsRequirements ? (
          <CheckCircle2 className="h-6 w-6 text-success" data-testid="icon-hours-pass" />
        ) : (
          <XCircle className="h-6 w-6 text-error" data-testid="icon-hours-fail" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground mb-1">Days Open</p>
          <p className="text-2xl font-semibold font-mono" data-testid="text-days-open">
            {data.daysOpen}
            <span className="text-base text-muted-foreground font-normal ml-1">/ 7</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.daysOpen >= 5 ? "✓ Meets 5-day requirement" : "✗ Below 5-day requirement"}
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground mb-1">Avg Hours/Day</p>
          <p className="text-2xl font-semibold font-mono" data-testid="text-hours-per-day">
            {data.averageHoursPerDay.toFixed(1)}
            <span className="text-base text-muted-foreground font-normal ml-1">hrs</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.averageHoursPerDay >= 9 ? "✓ Meets 9-hour requirement" : "✗ Below 9-hour requirement"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Weekly Schedule</h4>
        <div className="space-y-1">
          {data.weeklySchedule.map((schedule, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border text-sm ${
                schedule.isOpen ? "bg-card" : "bg-muted/50"
              }`}
              data-testid={`schedule-${index}`}
            >
              <span className={`font-medium ${!schedule.isOpen ? "text-muted-foreground" : ""}`}>
                {schedule.day}
              </span>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm ${!schedule.isOpen ? "text-muted-foreground" : ""}`}>
                  {schedule.hours}
                </span>
                {schedule.isOpen && schedule.hoursCount >= 9 && (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
