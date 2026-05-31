import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./Profile.styles";

export default function Profile() {
  const { profile, signOut } = useAuth();

  const displayName = profile?.display_name || profile?.username || "User";
  const username    = profile?.username ?? "";
  const initials    = displayName[0].toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Avatar + name */}
        <View style={styles.header}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={[styles.avatarCircle, { overflow: "hidden" }]} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{initials}</Text>
            </View>
          )}
          <Text style={styles.displayName}>{displayName}</Text>
          {username ? <Text style={styles.username}>@{username}</Text> : null}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
