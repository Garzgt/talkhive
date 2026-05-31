import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./MessageBubble.styles";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, isOwn, onLongPress }) {
  const name = message.sender?.display_name || message.sender?.username || "Unknown";

  return (
    <TouchableOpacity
      style={[styles.row, isOwn && styles.rowOwn]}
      onLongPress={onLongPress}
      delayLongPress={400}
      activeOpacity={0.85}
    >
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {!isOwn && <Text style={styles.senderName}>{name}</Text>}
        <Text style={[styles.body, isOwn && styles.bodyOwn]}>{message.body}</Text>
        <Text style={[styles.time, isOwn && styles.timeOwn]}>{formatTime(message.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}
