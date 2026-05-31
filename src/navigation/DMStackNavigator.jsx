import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../config/routes";
import DMInbox from "../screens/DirectMessages/DMInbox";
import DMConversation from "../screens/DirectMessages/DMConversation";

const Stack = createNativeStackNavigator();

export default function DMStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DMList"                  component={DMInbox} />
      <Stack.Screen name={ROUTES.DM_CONVERSATION} component={DMConversation} />
    </Stack.Navigator>
  );
}
