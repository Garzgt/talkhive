import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./CreateRoomModal.styles";

export default function CreateRoomModal({ visible, onClose, onCreate }) {
  const [name, setName]       = useState("");
  const [desc, setDesc]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleCreate() {
    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onCreate(name, desc);
      setName("");
      setDesc("");
      onClose();
    } catch (e) {
      setError(e.message || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setName("");
    setDesc("");
    setError("");
    onClose();
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.overlay} onPress={handleClose} />

        <Pressable style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Create Room</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Room name *"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            maxLength={60}
            returnKeyType="next"
          />

          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder="Description (optional)"
            placeholderTextColor="#9CA3AF"
            value={desc}
            onChangeText={setDesc}
            maxLength={200}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {error ? <Text style={styles.errText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleCreate}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Create Room</Text>
            }
          </TouchableOpacity>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
