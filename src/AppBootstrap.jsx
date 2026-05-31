import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";

export default function AppBootstrap() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
