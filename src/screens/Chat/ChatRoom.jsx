import { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, Modal,
  KeyboardAvoidingView, Alert, ActivityIndicator, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../config/routes";
import { colors } from "../../styles/colors";
import { styles } from "./ChatRoom.styles";
import MessageBubble from "./components/MessageBubble";
import { fetchMessages, sendMessage, deleteMessage, editMessage, toggleReaction } from "./services/chatService";
import { subscribeToRoom } from "./services/chatRealtimeService";
import { pickImage, uploadImage } from "../../utils/uploadImage";
import { supabase } from "../../config/supabase";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export default function ChatRoom({ navigation, route }) {
  const { roomId, roomName } = route.params;
  const { profile } = useAuth();

  const [messages, setMessages]       = useState([]);
  const [text, setText]               = useState("");
  const [image, setImage]             = useState(null);
  const [viewingImage, setViewing]    = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sending, setSending]         = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [actionMessage, setAction]    = useState(null);
  const [editingMsg, setEditingMsg]   = useState(null);

  const typingChanRef  = useRef(null);
  const typingTimerRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchMessages(roomId);
      setMessages([...data].reverse());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadMessages();

    const unsubscribe = subscribeToRoom(roomId, {
      onInsert: (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [newMsg, ...prev];
        });
      },
      onEdit: (updated) => {
        if (updated.is_deleted) {
          setMessages((prev) => prev.filter((m) => m.id !== updated.id));
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updated.id ? { ...m, body: updated.body, is_edited: updated.is_edited } : m
            )
          );
        }
      },
      onReaction: ({ reaction, type }) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== reaction.message_id) return m;
            let reactions;
            if (type === "add") {
              // Remove every reaction from this user (real or temp) then add the confirmed one.
              // This handles "replace emoji" correctly even if the DELETE event arrives without
              // full row data (before REPLICA IDENTITY FULL takes effect).
              const without = (m.reactions || []).filter((r) => r.user_id !== reaction.user_id);
              reactions = [...without, reaction];
            } else {
              reactions = (m.reactions || []).filter((r) => r.id !== reaction.id);
            }
            return { ...m, reactions };
          })
        );
      },
    });

    return unsubscribe;
  }, [roomId]);

  // Typing presence channel
  useEffect(() => {
    if (!profile?.id) return;
    const chan = supabase.channel(`typing:room:${roomId}`, {
      config: { presence: { key: profile.id } },
    });
    chan
      .on("presence", { event: "sync" }, () => {
        const state = chan.presenceState();
        const names = Object.entries(state)
          .filter(([key]) => key !== profile.id)
          .map(([, arr]) => arr[0]?.name)
          .filter(Boolean);
        setTypingUsers(names);
      })
      .subscribe();
    typingChanRef.current = chan;
    return () => {
      clearTimeout(typingTimerRef.current);
      supabase.removeChannel(chan);
    };
  }, [roomId, profile?.id]);

  function handleTextChange(val) {
    setText(val);
    if (!typingChanRef.current) return;
    typingChanRef.current.track({ name: profile?.display_name || profile?.username || "Someone" });
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      typingChanRef.current?.untrack();
    }, 2000);
  }

  async function handlePickImage() {
    try {
      const asset = await pickImage();
      if (asset) setImage(asset);
    } catch (e) {
      Alert.alert("Error", e.message || "Could not open gallery.");
    }
  }

  const canSend = editingMsg
    ? text.trim().length > 0 && !sending
    : (text.trim().length > 0 || image !== null) && !sending;

  async function handleSend() {
    if (!canSend) return;

    typingChanRef.current?.untrack();
    clearTimeout(typingTimerRef.current);

    if (editingMsg) {
      const newBody = text.trim();
      setText("");
      setSending(true);
      try {
        await editMessage(editingMsg.id, newBody);
        setMessages((prev) =>
          prev.map((m) => m.id === editingMsg.id ? { ...m, body: newBody, is_edited: true } : m)
        );
        setEditingMsg(null);
      } catch {
        Alert.alert("Error", "Could not save edit.");
        setText(newBody);
      } finally {
        setSending(false);
      }
      return;
    }

    const body         = text.trim();
    const pendingImage = image;
    setText("");
    setImage(null);
    setSending(true);

    try {
      let attachment = null;
      if (pendingImage) attachment = await uploadImage(profile.id, pendingImage);
      const msg = await sendMessage(roomId, profile.id, body, attachment);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [msg, ...prev];
      });
    } catch {
      setText(body);
      setImage(pendingImage);
    } finally {
      setSending(false);
    }
  }

  function closeActions() { setAction(null); }

  function handleLongPress(message) {
    setAction(message);
  }

  async function handleReact(emoji) {
    if (!actionMessage) return;
    const msg = actionMessage;
    closeActions();

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msg.id) return m;
        const existing = (m.reactions || []).find((r) => r.user_id === profile.id);
        let reactions;
        if (existing?.emoji === emoji) {
          reactions = (m.reactions || []).filter((r) => r.id !== existing.id);
        } else if (existing) {
          reactions = [
            ...(m.reactions || []).filter((r) => r.id !== existing.id),
            { id: `opt_${Date.now()}`, message_id: msg.id, user_id: profile.id, emoji },
          ];
        } else {
          reactions = [
            ...(m.reactions || []),
            { id: `opt_${Date.now()}`, message_id: msg.id, user_id: profile.id, emoji },
          ];
        }
        return { ...m, reactions };
      })
    );

    try {
      await toggleReaction(msg.id, profile.id, emoji);
    } catch {
      Alert.alert("Error", "Could not react.");
    }
  }

  function handleEdit() {
    setEditingMsg(actionMessage);
    setText(actionMessage.body || "");
    closeActions();
  }

  function cancelEdit() {
    setEditingMsg(null);
    setText("");
  }

  async function handleDelete() {
    const msg = actionMessage;
    closeActions();
    try {
      await deleteMessage(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch {
      Alert.alert("Error", "Could not delete message.");
    }
  }

  const typingLabel = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : typingUsers.length > 1 ? "Several people are typing..." : null;

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
        behavior="padding"
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
                currentUserId={profile.id}
                onLongPress={() => handleLongPress(item)}
                onImagePress={(url) => setViewing(url)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        {typingLabel && (
          <View style={styles.typingRow}>
            <Text style={styles.typingText}>{typingLabel}</Text>
          </View>
        )}

        <View style={styles.inputWrapper}>
          {editingMsg && (
            <View style={styles.editingBar}>
              <Ionicons name="pencil" size={14} color={colors.primaryDark} />
              <Text style={styles.editingBarText} numberOfLines={1}>{editingMsg.body || "message"}</Text>
              <TouchableOpacity onPress={cancelEdit} hitSlop={8}>
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}
          {image && !editingMsg && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: image.uri }} style={styles.previewThumb} resizeMode="cover" />
              <TouchableOpacity style={styles.removeImage} onPress={() => setImage(null)} hitSlop={6}>
                <Ionicons name="close-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputBar}>
            {!editingMsg && (
              <TouchableOpacity style={styles.imageBtn} onPress={handlePickImage} hitSlop={8}>
                <Ionicons name="image-outline" size={22} color="#6B7280" />
              </TouchableOpacity>
            )}
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={handleTextChange}
              multiline
              maxLength={2000}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!canSend}
              activeOpacity={0.8}
            >
              {sending
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="send" size={18} color="#fff" />
              }
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Fullscreen image viewer */}
      <Modal visible={!!viewingImage} transparent animationType="fade" onRequestClose={() => setViewing(null)}>
        <View style={styles.viewerBg}>
          <Image source={{ uri: viewingImage }} style={styles.viewerImage} resizeMode="contain" />
          <TouchableOpacity style={styles.viewerClose} onPress={() => setViewing(null)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Message action sheet */}
      <Modal visible={!!actionMessage} transparent animationType="fade" onRequestClose={closeActions}>
        <TouchableOpacity style={styles.actionOverlay} activeOpacity={1} onPress={closeActions}>
          <View style={styles.actionSheet}>
            <View style={styles.reactionRow}>
              {REACTION_EMOJIS.map((e) => (
                <TouchableOpacity key={e} style={styles.reactionBtn} onPress={() => handleReact(e)}>
                  <Text style={styles.reactionBtnEmoji}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {actionMessage?.sender_id === profile.id && (
              <>
                {actionMessage.body && (
                  <TouchableOpacity style={styles.actionItem} onPress={handleEdit}>
                    <Ionicons name="pencil-outline" size={18} color={colors.text} />
                    <Text style={styles.actionItemText}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionItem} onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                  <Text style={[styles.actionItemText, styles.actionItemDanger]}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
