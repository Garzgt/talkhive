import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";
import { styles } from "./UsernameStep.styles";

export default function UsernameStep({ username, displayName, onChangeDisplayName, onContinue, loading }) {
  const [focused, setFocused] = useState(false);
  const initial = (displayName || username || "?")[0].toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.avatarPreview}>
        <Text style={styles.avatarInitial}>{initial}</Text>
      </View>

      <Text style={styles.heading}>Set up your profile</Text>
      <Text style={styles.subheading}>How should others see you?</Text>

      {/* Username — read-only */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.readonlyRow}>
          <Ionicons name="at-outline" size={18} color={colors.textMuted} />
          <Text style={styles.readonlyText}>{username}</Text>
          <Ionicons name="lock-closed-outline" size={13} color={colors.textMuted} />
        </View>
        <Text style={styles.hint}>Your username can't be changed here</Text>
      </View>

      {/* Display name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Display Name</Text>
        <View style={[styles.inputRow, focused && { borderColor: colors.primary, backgroundColor: colors.background }]}>
          <Ionicons
            name="person-outline"
            size={18}
            color={focused ? colors.primary : colors.textMuted}
          />
          <TextInput
            style={styles.inputField}
            value={displayName}
            onChangeText={onChangeDisplayName}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Your full name or nickname"
            placeholderTextColor={colors.textMuted}
            maxLength={40}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        <Text style={styles.charCount}>{displayName.length}/40</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, (!displayName.trim() || loading) && styles.btnDisabled]}
        onPress={onContinue}
        disabled={!displayName.trim() || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Text style={styles.btnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
