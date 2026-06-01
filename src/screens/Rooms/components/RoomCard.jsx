import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";
import { styles } from "./RoomCard.styles";

const AVATAR_COLORS = [
  "#F97316", "#8B5CF6", "#06B6D4", "#10B981",
  "#EF4444", "#F59E0B", "#3B82F6", "#EC4899",
];

function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function RoomCard({ room, onPress }) {
  const initial = room.name[0].toUpperCase();
  const color   = avatarColor(room.name);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.72}>
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.nameWrap}>
            <Text style={styles.name} numberOfLines={1}>{room.name}</Text>
            {room.is_private && (
              <Ionicons name="lock-closed" size={11} color={colors.textMuted} style={{ marginTop: 2 }} />
            )}
          </View>
          {room.is_joined && (
            <View style={styles.joinedBadge}>
              <Text style={styles.joinedText}>Joined</Text>
            </View>
          )}
          {room.is_pending && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          )}
        </View>

        {room.description ? (
          <Text style={styles.desc} numberOfLines={1}>{room.description}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={12} color={colors.textMuted} />
          <Text style={styles.meta}>
            {room.member_count} {room.member_count === 1 ? "member" : "members"}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.borderDark} />
    </TouchableOpacity>
  );
}
