import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { ROUTES } from "../config/routes";
import { colors } from "../styles/colors";
import { fonts } from "../styles/fonts";
import ChatStackNavigator from "./ChatStackNavigator";
import DMStackNavigator from "./DMStackNavigator";
import Search from "../screens/Search/Search";
import NotificationInbox from "../screens/Notifications/NotificationInbox";
import Profile from "../screens/Profile/Profile";

const Tab = createBottomTabNavigator();

const icon = (label) => ({ focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.border },
      }}
    >
      <Tab.Screen name={ROUTES.ROOMS}         component={ChatStackNavigator}  options={{ title: "Rooms",   tabBarIcon: icon("💬") }} />
      <Tab.Screen name={ROUTES.DM_INBOX}      component={DMStackNavigator}    options={{ title: "DMs",     tabBarIcon: icon("✉️") }} />
      <Tab.Screen name={ROUTES.SEARCH}        component={Search}              options={{ title: "Search",  tabBarIcon: icon("🔍") }} />
      <Tab.Screen name={ROUTES.NOTIFICATIONS} component={NotificationInbox}   options={{ title: "Alerts",  tabBarIcon: icon("🔔") }} />
      <Tab.Screen name={ROUTES.PROFILE}       component={Profile}             options={{ title: "Profile", tabBarIcon: icon("👤") }} />
    </Tab.Navigator>
  );
}
