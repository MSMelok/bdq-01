import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StateRejectionCardProps {
  stateCode: string;
  stateName: string;
  isAutoRejected: boolean;
  rejectionReason: string | null;
}

export function StateRejectionCard({
  stateCode,
  stateName,
  isAutoRejected,
  rejectionReason,
}: StateRejectionCardProps) {
  if (!isAutoRejected) {
    return null;
  }

  return (
    <Card className="p-4 bg-error/5 border-error/20" data-testid="card-state-rejection">
      <Alert className="border-error/30 bg-error/5">
        <AlertCircle className="h-5 w-5 text-error" />
        <AlertTitle className="text-error font-semibold">
          State Not Allowed
        </AlertTitle>
        <AlertDescription className="text-error/90 mt-2">
          <p className="font-semibold mb-1">
            {stateName} ({stateCode})
          </p>
          <p className="text-sm">
            {rejectionReason || "This state does not allow Bitcoin Depot kiosks"}
          </p>
        </AlertDescription>
      </Alert>
    </Card>
  );
}
