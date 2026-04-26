import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/features/theme/model/theme-context";
import { AppRouter } from "./router";
import { queryClient } from "./services/query-client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="niklabs-theme">
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
