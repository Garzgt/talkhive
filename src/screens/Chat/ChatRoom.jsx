import { useEffect, useState, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../config/routes";
import { styles } from "./ChatRoom.styles";
import MessageBubble from "./components/MessageBubble";
import { fetchMessages, sendMessage, deleteMessage } from "./services/chatService";
import { subscribeToRoom } from "./services/chatRealtimeService";

export default function ChatRoom({ navigation, route }) {
  const { roomId, roomName } = route.params;
  const { profile }          = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchMessages(roomId);
      setMessages([...data].reverse());
    } catch {
      // silent — user sees empty state
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadMessages();

    const unsubscribe = subscribeToRoom(roomId, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [newMsg, ...prev];
      });
    });

    return unsubscribe;
  }, [roomId]);

  async function handleSend() {
    const body = text.trim();
    if (!body || sending) return;
    setText("");
    setSending(true);
    try {
      const msg = await sendMessage(roomId, profile.id, body);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [msg, ...prev];
      });
    } catch {
      setText(body);
    } finally {
      setSending(false);
    }
  }

  function handleLongPress(message) {
    if (message.sender_id !== profile.id) return;
    Alert.alert("Delete Message", "Delete this message?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMessage(message.id);
            setMessages((prev) => prev.filter((m) => m.id !== message.id));
          } catch {
            Alert.alert("Error", "Could not delete message.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.roomName} numberOfLines={1}>{roomName}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.ROOM_INFO, { roomId, roomName })}
          hitSlop={10}
        >
          <Ionicons name="information-circle-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#F97316" />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            inverted
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isOwn={item.sender_id === profile.id}
                onLongPress={() => handleLongPress(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#9CA3AF"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
            activeOpacity={0.8}
          >
            {sending
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="send" size={18} color="#fff" />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
