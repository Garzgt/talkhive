import { View, Text } from "react-native";
import { styles } from "./AuthHeader.styles";

export default function AuthHeader({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        Talk<Text style={styles.dot}>Hive</Text>
      </Text>
      {title    && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}
