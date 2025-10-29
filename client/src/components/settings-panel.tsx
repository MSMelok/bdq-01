import { useState, useEffect, createContext, useContext } from "react";
import { Settings as SettingsIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Settings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const SettingsContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SettingsContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

export function SettingsButton() {
  const { setIsOpen } = useSettings();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(true)}
      data-testid="button-settings-open"
      className="rounded-lg"
    >
      <SettingsIcon className="h-5 w-5" />
      <span className="sr-only">Settings</span>
    </Button>
  );
}

export function SettingsModal() {
  const { isOpen, setIsOpen } = useSettings();
  const { toast } = useToast();

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const [formData, setFormData] = useState({
    minimumPopulationDensity: 1000,
    searchRadiusMiles: 1,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        minimumPopulationDensity: settings.minimumPopulationDensity,
        searchRadiusMiles: settings.searchRadiusMiles,
      });
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Settings) => {
      return await apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your qualification thresholds have been updated.",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-background border rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-settings-close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Card className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="population-density" className="text-sm font-medium">
                    Minimum Population Density
                  </Label>
                  <Input
                    id="population-density"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.minimumPopulationDensity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumPopulationDensity: parseInt(e.target.value) || 0,
                      })
                    }
                    data-testid="input-population-density"
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    People per square mile required for qualification
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-radius" className="text-sm font-medium">
                    Search Radius (miles)
                  </Label>
                  <Input
                    id="search-radius"
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.5"
                    value={formData.searchRadiusMiles}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        searchRadiusMiles: parseFloat(e.target.value) || 1,
                      })
                    }
                    data-testid="input-search-radius"
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Radius to search for nearby Bitcoin ATMs
                  </p>
                </div>
              </Card>

              <Button
                onClick={handleSave}
                className="w-full"
                disabled={updateSettingsMutation.isPending}
                data-testid="button-settings-save"
              >
                {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
  );
}
