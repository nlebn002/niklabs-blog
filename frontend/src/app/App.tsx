import { AppProviders } from "./providers/app-providers";
import { AppRouter } from "./providers/router";

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
