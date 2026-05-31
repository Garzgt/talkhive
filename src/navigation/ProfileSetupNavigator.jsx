import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../config/routes";
import ProfileSetup from "../screens/ProfileSetup/ProfileSetup";

const Stack = createNativeStackNavigator();

export default function ProfileSetupNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.PROFILE_SETUP} component={ProfileSetup} />
    </Stack.Navigator>
  );
}
