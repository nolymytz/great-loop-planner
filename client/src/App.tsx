import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const PlannerPage  = lazy(() => import("./pages/PlannerPage"));
const TripsPage    = lazy(() => import("./pages/TripsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Switch>
        <Route path="/"              component={Home} />
        <Route path="/trips"         component={TripsPage} />
        <Route path="/planner/:tripId" component={PlannerPage} />
        <Route path="/planner"       component={PlannerPage} />
        <Route path="/settings"      component={SettingsPage} />
        <Route                       component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
