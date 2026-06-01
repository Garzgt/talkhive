import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES } from "../config/routes";
import { colors } from "../styles/colors";
import { fonts } from "../styles/fonts";
import { useNotifications } from "../context/NotificationContext";
import ChatStackNavigator from "./ChatStackNavigator";
import DMStackNavigator from "./DMStackNavigator";
import Search from "../screens/Search/Search";
import NotificationInbox from "../screens/Notifications/NotificationInbox";
import Profile from "../screens/Profile/Profile";

const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={24}
      color={focused ? colors.primary : colors.textMuted}
    />
  );
}

function AlertsIcon({ focused }) {
  const { unreadCount } = useNotifications();
  return (
    <View>
      <Ionicons
        name={focused ? "notifications" : "notifications-outline"}
        size={24}
        color={focused ? colors.primary : colors.textMuted}
      />
      {unreadCount > 0 && (
        <View style={{
          position:          "absolute",
          top:               -3,
          right:             -5,
          backgroundColor:   colors.error,
          borderRadius:      9999,
          minWidth:          16,
          height:            16,
          alignItems:        "center",
          justifyContent:    "center",
          paddingHorizontal: 3,
          borderWidth:       2,
          borderColor:       colors.background,
        }}>
          <Text style={{ color: "#fff", fontSize: 9, fontFamily: fonts.bold }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize:   11,
          marginTop:  2,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth:  0,
          elevation:       12,
          shadowColor:     "#000",
          shadowOffset:    { width: 0, height: -3 },
          shadowOpacity:   0.08,
          shadowRadius:    12,
          height:          62 + insets.bottom,
          paddingBottom:   insets.bottom + 8,
          paddingTop:      8,
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.ROOMS}
        component={ChatStackNavigator}
        options={{
          title: "Rooms",
          tabBarIcon: ({ focused }) => <TabIcon name="chatbubbles" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.DM_INBOX}
        component={DMStackNavigator}
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => <TabIcon name="paper-plane" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.SEARCH}
        component={Search}
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.NOTIFICATIONS}
        component={NotificationInbox}
        options={{
          title: "Alerts",
          tabBarIcon: ({ focused }) => <AlertsIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
