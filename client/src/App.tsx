import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsPanel } from "@/components/settings-panel";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { SiBitcoin } from "react-icons/si";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light">
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <SiBitcoin className="h-7 w-7 text-primary" />
                  <div>
                    <h1 className="text-lg font-semibold tracking-tight">Bitcoin Depot</h1>
                    <p className="text-xs text-muted-foreground">Location Intelligence</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <SettingsPanel />
                </div>
              </div>
            </header>
            <main>
              <Router />
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
