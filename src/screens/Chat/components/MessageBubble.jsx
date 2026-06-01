import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./MessageBubble.styles";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function groupReactions(reactions, currentUserId) {
  const map = {};
  for (const r of reactions ?? []) {
    if (!map[r.emoji]) map[r.emoji] = { count: 0, mine: false };
    map[r.emoji].count++;
    if (r.user_id === currentUserId) map[r.emoji].mine = true;
  }
  return Object.entries(map);
}

export default function MessageBubble({ message, isOwn, currentUserId, onLongPress, onImagePress }) {
  const name       = message.sender?.display_name || message.sender?.username || "Unknown";
  const attachment = message.attachments?.[0];
  const avatarUrl  = message.sender?.avatar_url;
  const reactionGroups = groupReactions(message.reactions, currentUserId);

  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      {!isOwn && (
        <View style={styles.avatarWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{name[0].toUpperCase()}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.bubbleCol}>
        <TouchableOpacity
          style={styles.bubbleWrapper}
          onLongPress={onLongPress}
          delayLongPress={400}
          activeOpacity={0.85}
        >
          <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
            {!isOwn && <Text style={styles.senderName}>{name}</Text>}
            {attachment?.url && (
              <TouchableOpacity activeOpacity={0.85} onPress={() => onImagePress?.(attachment.url)}>
                <Image
                  source={{ uri: attachment.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            {message.body ? (
              <Text style={[styles.body, isOwn && styles.bodyOwn]}>{message.body}</Text>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 3 }}>
              {message.is_edited && (
                <Text style={[styles.editedTag, isOwn && styles.editedTagOwn]}>(edited)</Text>
              )}
              <Text style={[styles.time, isOwn && styles.timeOwn]}>{formatTime(message.created_at)}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {reactionGroups.length > 0 && (
          <View style={[styles.reactionBar, isOwn && styles.reactionBarOwn]}>
            {reactionGroups.map(([emoji, { count, mine }]) => (
              <View key={emoji} style={[styles.reactionPill, mine && styles.reactionPillMine]}>
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                {count > 1 && <Text style={styles.reactionCount}>{count}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
