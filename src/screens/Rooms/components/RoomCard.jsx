import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./RoomCard.styles";

export default function RoomCard({ room, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.avatar}>
        <Ionicons name="chatbubbles" size={22} color="#fff" />
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{room.name}</Text>
          {room.is_joined && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Joined</Text>
            </View>
          )}
          {room.is_pending && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Requested</Text>
            </View>
          )}
        </View>

        {room.description ? (
          <Text style={styles.desc} numberOfLines={2}>{room.description}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={13} color="#6B7280" />
          <Text style={styles.meta}>
            {room.member_count} member{room.member_count !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
