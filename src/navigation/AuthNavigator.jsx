import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../config/routes";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import WelcomeTour from "../screens/Onboarding/WelcomeTour";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.LOGIN}           component={Login} />
      <Stack.Screen name={ROUTES.REGISTER}        component={Register} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
      <Stack.Screen name={ROUTES.WELCOME_TOUR}    component={WelcomeTour} />
    </Stack.Navigator>
  );
}
