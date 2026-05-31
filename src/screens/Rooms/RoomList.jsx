import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import AlertModal from "../Auth/components/AlertModal";
import sessionFlags from "../../state/sessionFlags";
import { colors } from "../../styles/colors";

export default function RoomList() {
  const { profile } = useAuth();
  const [welcome, setWelcome] = useState({ visible: false, title: "", message: "" });

  useEffect(() => {
    if (sessionFlags.showWelcome) {
      sessionFlags.showWelcome = false;
      setWelcome({
        visible: true,
        title:   "Welcome to TalkHive!",
        message: `Hey ${profile?.display_name || profile?.username || "there"}, your account is all set. Start exploring rooms and connect with your hive.`,
      });
    } else if (sessionFlags.showLoginWelcome) {
      sessionFlags.showLoginWelcome = false;
      const name        = profile?.display_name || profile?.username || "there";
      const createdAt   = profile?.created_at ? new Date(profile.created_at) : null;
      const ageMinutes  = createdAt ? (Date.now() - createdAt.getTime()) / 60000 : null;
      const isNew       = ageMinutes !== null && ageMinutes < 5;
      setWelcome({
        visible: true,
        title:   isNew ? "Welcome to TalkHive!" : "Welcome back!",
        message: isNew
          ? `Hey ${name}, your account is all set. Start exploring rooms and connect with your hive.`
          : `Good to see you again, ${name}.`,
      });
    }
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        <Text style={s.t}>Rooms</Text>
      </View>

      <AlertModal
        visible={welcome.visible}
        type="success"
        title={welcome.title}
        message={welcome.message}
        onClose={() => setWelcome((w) => ({ ...w, visible: false }))}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  t:      { fontSize: 18, color: colors.textSecondary },
});
