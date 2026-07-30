import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./contexts/AuthContext";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

const Home = lazy(() => import("./pages/Home"));

const PlannerPage      = lazy(() => import("./pages/PlannerPage"));
const TripsPage        = lazy(() => import("./pages/TripsPage"));
const SettingsPage     = lazy(() => import("./pages/SettingsPage"));
const FuelCalcPage     = lazy(() => import("./pages/FuelCalcPage"));
const MaintenancePage  = lazy(() => import("./pages/MaintenancePage"));
const LogbookPage      = lazy(() => import("./pages/LogbookPage"));
const MarinasPage      = lazy(() => import("./pages/MarinasPage"));
const WeatherPage      = lazy(() => import("./pages/WeatherPage"));
const CommunityPage    = lazy(() => import("./pages/CommunityPage"));
const DreamBoatPage    = lazy(() => import("./pages/DreamBoatPage"));
const WishlistPage     = lazy(() => import("./pages/WishlistPage"));

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#f9f9f9]" />;
  if (!isAuthenticated) return <Redirect to="/auth" />;
  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#002b49]" />}>
      <Switch>
        {/* Coming soon — public landing page */}
        <Route path="/"                  component={ComingSoon} />
        {/* Full app under /app prefix */}
        <Route path="/app"               component={Home} />
        <Route path="/app/auth">
          {isAuthenticated ? <Redirect to="/trips" /> : <AuthPage />}
        </Route>
        <Route path="/auth">
          {isAuthenticated ? <Redirect to="/trips" /> : <AuthPage />}
        </Route>
        <Route path="/trips">             <ProtectedRoute component={TripsPage} /></Route>
        <Route path="/planner/:tripId">   <ProtectedRoute component={PlannerPage} /></Route>
        <Route path="/planner">           <ProtectedRoute component={PlannerPage} /></Route>
        <Route path="/fuel">              <ProtectedRoute component={FuelCalcPage} /></Route>
        <Route path="/maintenance">       <ProtectedRoute component={MaintenancePage} /></Route>
        <Route path="/logbook">           <ProtectedRoute component={LogbookPage} /></Route>
        <Route path="/marinas">           <ProtectedRoute component={MarinasPage} /></Route>
        <Route path="/weather">           <ProtectedRoute component={WeatherPage} /></Route>
        <Route path="/community">         <ProtectedRoute component={CommunityPage} /></Route>
        <Route path="/dream-boat">        <ProtectedRoute component={DreamBoatPage} /></Route>
        <Route path="/wishlist">          <ProtectedRoute component={WishlistPage} /></Route>
        <Route path="/settings">          <ProtectedRoute component={SettingsPage} /></Route>
        <Route                           component={NotFound} />
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
