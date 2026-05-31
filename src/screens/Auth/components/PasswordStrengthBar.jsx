import { View, Text } from "react-native";
import { getPasswordStrength } from "../../../utils/validation";
import { styles, getStrengthInfo } from "./PasswordStrengthBar.styles";

export default function PasswordStrengthBar({ password }) {
  if (!password) return null;
  const score    = getPasswordStrength(password);
  const { color, label } = getStrengthInfo(score);
  const filled   = Math.ceil((score / 5) * 4);

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.bar, i < filled && { backgroundColor: color }]}
          />
        ))}
      </View>
      {label ? <Text style={[styles.label, { color }]}>{label}</Text> : null}
    </View>
  );
}
