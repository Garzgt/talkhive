import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../config/routes";
import RoomList from "../screens/Rooms/RoomList";
import ChatRoom from "../screens/Chat/ChatRoom";
import RoomInfo from "../screens/Chat/RoomInfo";

const Stack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.ROOMS}     component={RoomList} />
      <Stack.Screen name={ROUTES.CHAT_ROOM} component={ChatRoom} />
      <Stack.Screen name={ROUTES.ROOM_INFO} component={RoomInfo} />
    </Stack.Navigator>
  );
}
