import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface QualificationSummaryProps {
  qualified: boolean;
  summary: string;
}

export function QualificationSummary({ qualified, summary }: QualificationSummaryProps) {
  return (
    <Card
      className={`p-8 border-2 ${
        qualified
          ? "bg-success/5 border-success/20"
          : "bg-error/5 border-error/20"
      }`}
      data-testid="card-qualification-summary"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {qualified ? (
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle2 className="h-8 w-8 text-success" data-testid="icon-qualified" />
            </div>
          ) : (
            <div className="rounded-full bg-error/10 p-3">
              <XCircle className="h-8 w-8 text-error" data-testid="icon-disqualified" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {qualified ? "✓ Qualified for Placement" : "✗ Not Qualified"}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </Card>
  );
}
