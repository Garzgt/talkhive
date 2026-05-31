import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./UserSearchResult.styles";

export default function UserSearchResult({ user, onPress }) {
  const name     = user.display_name || user.username;
  const initials = name[0].toUpperCase();

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
        {user.is_online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.username} numberOfLines={1}>@{user.username}</Text>
      </View>
    </TouchableOpacity>
  );
}
