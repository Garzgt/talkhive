import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import { PresenceProvider } from "../context/PresenceContext";
import { colors } from "../styles/colors";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <NotificationProvider>
          <PresenceProvider>
            <MainTabNavigator />
          </PresenceProvider>
        </NotificationProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
