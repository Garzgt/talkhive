import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./DMConversationCard.styles";

function formatTime(iso) {
  const d       = new Date(iso);
  const now     = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function DMConversationCard({ conversation, onPress, onLongPress }) {
  const { profile, lastMessage, unreadCount } = conversation;
  const name      = profile?.display_name || profile?.username || "Unknown";
  const initials  = name[0].toUpperCase();
  const hasUnread = unreadCount > 0;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} onLongPress={onLongPress} delayLongPress={400} activeOpacity={0.75}>
      <View style={styles.avatarWrap}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}
        {profile?.is_online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={[styles.name, hasUnread && styles.nameBold]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.time}>{formatTime(lastMessage.created_at)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text
            style={[styles.preview, hasUnread && styles.previewBold]}
            numberOfLines={1}
          >
            {lastMessage.body || "📷 Photo"}
          </Text>
          {hasUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
