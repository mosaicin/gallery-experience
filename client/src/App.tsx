import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";

/** Style note: Nocturne Museum — the route is intentionally a single immersive room, not a conventional multi-page shell. */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Home />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
