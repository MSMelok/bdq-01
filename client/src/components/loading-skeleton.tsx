import { Card } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-muted h-14 w-14" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-5 bg-muted rounded w-3/4" />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted h-10 w-10" />
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-32" />
                  <div className="h-4 bg-muted rounded w-24" />
                </div>
              </div>
              <div className="h-6 w-6 bg-muted rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="h-16 bg-muted rounded" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
