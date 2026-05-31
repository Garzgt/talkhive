import { useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";
import { styles } from "./AlertModal.styles";

const TYPE_CONFIG = {
  error: {
    icon: "alert-circle",
    color: colors.error,
    bg: colors.errorLight,
    defaultTitle: "Something went wrong",
  },
  warning: {
    icon: "warning",
    color: colors.warning,
    bg: colors.warningLight,
    defaultTitle: "Warning",
  },
  success: {
    icon: "checkmark-circle",
    color: colors.success,
    bg: colors.successLight,
    defaultTitle: "Success",
  },
};

export default function AlertModal({
  visible,
  type = "error",
  title,
  message,
  onClose,
}) {
  const scale   = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [visible]);

  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.error;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.card, { transform: [{ scale }], opacity }]}
          // Prevent overlay tap from closing when tapping the card
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={38} color={cfg.color} />
          </View>

          <Text style={styles.title}>
            {title ?? cfg.defaultTitle}
          </Text>

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={styles.btn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Got it</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
