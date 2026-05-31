import { useEffect, useState, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./DMConversation.styles";
import { fetchDMMessages, sendDM, deleteDM, markMessagesRead } from "./services/dmService";
import { subscribeToDM } from "./services/dmRealtimeService";

export default function DMConversation({ navigation, route }) {
  const { userId: otherId, userName } = route.params;
  const { profile }                   = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);

  const loadMessages = useCallback(async () => {
    console.log("[DMConversation] loading messages — otherId:", otherId);
    try {
      const data = await fetchDMMessages(profile.id, otherId);
      console.log("[DMConversation] got", data.length, "messages");
      setMessages([...data].reverse());
      markMessagesRead(profile.id, otherId);
    } catch (e) {
      console.log("[DMConversation] load error →", e);
    } finally {
      setLoading(false);
    }
  }, [profile.id, otherId]);

  useEffect(() => {
    loadMessages();

    const unsubscribe = subscribeToDM(profile.id, otherId, (newMsg) => {
      console.log("[DMConversation] realtime message →", newMsg.id);
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [newMsg, ...prev];
      });
      markMessagesRead(profile.id, otherId);
    });

    return unsubscribe;
  }, [otherId]);

  async function handleSend() {
    const body = text.trim();
    if (!body || sending) return;
    setText("");
    setSending(true);
    try {
      const msg = await sendDM(profile.id, otherId, body);
      console.log("[DMConversation] sent →", msg.id);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [msg, ...prev];
      });
    } catch (e) {
      console.log("[DMConversation] send error →", e);
      setText(body);
    } finally {
      setSending(false);
    }
  }

  function handleLongPress(message) {
    if (message.from_id !== profile.id) return;
    Alert.alert("Delete Message", "Delete this message?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDM(message.id);
            setMessages((prev) => prev.filter((m) => m.id !== message.id));
          } catch {
            Alert.alert("Error", "Could not delete message.");
          }
        },
      },
    ]);
  }

  function renderBubble({ item }) {
    const isOwn = item.from_id === profile.id;
    return (
      <TouchableOpacity
        style={[styles.bubbleRow, isOwn && styles.bubbleRowOwn]}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={400}
        activeOpacity={0.85}
      >
        <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>{item.body}</Text>
          <Text style={[styles.bubbleTime, isOwn && styles.bubbleTimeOwn]}>
            {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerInitial}>{userName[0]?.toUpperCase()}</Text>
          </View>
          <Text style={styles.headerName} numberOfLines={1}>{userName}</Text>
        </View>

        <View style={styles.headerSpacer} />
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
            <Text style={styles.emptyText}>Say hello to {userName}!</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            inverted
            keyExtractor={(item) => item.id}
            renderItem={renderBubble}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={`Message ${userName}...`}
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
