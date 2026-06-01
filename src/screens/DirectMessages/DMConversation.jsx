import { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, Modal,
  KeyboardAvoidingView, Alert, ActivityIndicator, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles/colors";
import { styles } from "./DMConversation.styles";
import { fetchDMMessages, sendDM, deleteDM, editDM, markMessagesRead, toggleDMReaction } from "./services/dmService";
import { subscribeToDM } from "./services/dmRealtimeService";
import { pickImage, uploadImage } from "../../utils/uploadImage";
import { supabase } from "../../config/supabase";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function groupReactions(reactions, currentUserId) {
  const map = {};
  for (const r of reactions ?? []) {
    if (!map[r.emoji]) map[r.emoji] = { count: 0, mine: false };
    map[r.emoji].count++;
    if (r.user_id === currentUserId) map[r.emoji].mine = true;
  }
  return Object.entries(map);
}

export default function DMConversation({ navigation, route }) {
  const { userId: otherId, userName, userAvatar } = route.params;
  const { profile } = useAuth();

  const [messages, setMessages]       = useState([]);
  const [text, setText]               = useState("");
  const [image, setImage]             = useState(null);
  const [viewingImage, setViewing]    = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sending, setSending]         = useState(false);
  const [otherUser, setOtherUser]     = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [actionMessage, setAction]    = useState(null);
  const [editingMsg, setEditingMsg]   = useState(null);

  const typingChanRef  = useRef(null);
  const typingTimerRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchDMMessages(profile.id, otherId);
      setMessages([...data].reverse());
      markMessagesRead(profile.id, otherId);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [profile.id, otherId]);

  useEffect(() => {
    loadMessages();

    const unsubscribe = subscribeToDM(profile.id, otherId, {
      onInsert: (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [newMsg, ...prev];
        });
        markMessagesRead(profile.id, otherId);
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
            if (m.id !== reaction.dm_id) return m;
            let dm_reactions;
            if (type === "add") {
              // Remove every reaction from this user (real or temp) then add the confirmed one.
              const without = (m.dm_reactions || []).filter((r) => r.user_id !== reaction.user_id);
              dm_reactions = [...without, reaction];
            } else {
              dm_reactions = (m.dm_reactions || []).filter((r) => r.id !== reaction.id);
            }
            return { ...m, dm_reactions };
          })
        );
      },
    });

    return unsubscribe;
  }, [otherId]);

  // Other user's online status
  useEffect(() => {
    if (!otherId) return;
    supabase
      .from("profiles")
      .select("is_online, last_seen_at")
      .eq("id", otherId)
      .single()
      .then(({ data }) => { if (data) setOtherUser(data); });

    const chan = supabase
      .channel(`presence-user-${otherId}`)
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${otherId}`,
      }, (payload) => {
        setOtherUser({ is_online: payload.new.is_online, last_seen_at: payload.new.last_seen_at });
      })
      .subscribe();

    return () => supabase.removeChannel(chan);
  }, [otherId]);

  // Typing presence channel
  useEffect(() => {
    if (!profile?.id || !otherId) return;
    const dmKey = [profile.id, otherId].sort().join(":");
    const chan = supabase.channel(`typing:dm:${dmKey}`, {
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
  }, [profile?.id, otherId]);

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
        await editDM(editingMsg.id, newBody);
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
      const msg = await sendDM(profile.id, otherId, body, attachment);
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

  async function handleReact(emoji) {
    if (!actionMessage) return;
    const msg = actionMessage;
    closeActions();

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msg.id) return m;
        const existing = (m.dm_reactions || []).find((r) => r.user_id === profile.id);
        let dm_reactions;
        if (existing?.emoji === emoji) {
          dm_reactions = (m.dm_reactions || []).filter((r) => r.id !== existing.id);
        } else if (existing) {
          dm_reactions = [
            ...(m.dm_reactions || []).filter((r) => r.id !== existing.id),
            { id: `opt_${Date.now()}`, dm_id: msg.id, user_id: profile.id, emoji },
          ];
        } else {
          dm_reactions = [
            ...(m.dm_reactions || []),
            { id: `opt_${Date.now()}`, dm_id: msg.id, user_id: profile.id, emoji },
          ];
        }
        return { ...m, dm_reactions };
      })
    );

    try {
      await toggleDMReaction(msg.id, profile.id, emoji);
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
      await deleteDM(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch {
      Alert.alert("Error", "Could not delete message.");
    }
  }

  function renderBubble({ item }) {
    const isOwn          = item.from_id === profile.id;
    const attachment     = item.attachments?.[0];
    const reactionGroups = groupReactions(item.dm_reactions, profile.id);

    return (
      <View style={[styles.bubbleRow, isOwn && styles.bubbleRowOwn]}>
        <View style={styles.bubbleCol}>
          <TouchableOpacity
            style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}
            onLongPress={() => setAction(item)}
            delayLongPress={400}
            activeOpacity={0.85}
          >
            {attachment?.url && (
              <TouchableOpacity activeOpacity={0.85} onPress={() => setViewing(attachment.url)}>
                <Image source={{ uri: attachment.url }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
            )}
            {item.body ? (
              <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>{item.body}</Text>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 3 }}>
              {item.is_edited && (
                <Text style={[styles.editedTag, isOwn && styles.editedTagOwn]}>(edited)</Text>
              )}
              <Text style={[styles.bubbleTime, isOwn && styles.bubbleTimeOwn]}>
                {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </TouchableOpacity>

          {reactionGroups.length > 0 && (
            <View style={[styles.reactionBar, isOwn && styles.reactionBarOwn]}>
              {reactionGroups.map(([emoji, { count, mine }]) => (
                <View key={emoji} style={[styles.reactionPill, mine && styles.reactionPillMine]}>
                  <Text style={styles.reactionEmoji}>{emoji}</Text>
                  {count > 1 && <Text style={styles.reactionCount}>{count}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  const typingLabel = typingUsers.length > 0 ? `${userName} is typing...` : null;

  const statusText = otherUser?.is_online
    ? "Online"
    : otherUser?.last_seen_at
      ? `Last seen ${timeAgo(otherUser.last_seen_at)}`
      : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatarWrap}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.headerAvatarImage} />
            ) : (
              <View style={styles.headerAvatar}>
                <Text style={styles.headerInitial}>{userName[0]?.toUpperCase()}</Text>
              </View>
            )}
            {otherUser?.is_online && <View style={styles.headerOnlineDot} />}
          </View>
          <View style={styles.headerNameWrap}>
            <Text style={styles.headerName} numberOfLines={1}>{userName}</Text>
            {statusText && (
              <Text style={[styles.headerStatus, !otherUser?.is_online && styles.headerStatusOffline]}>
                {statusText}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.headerSpacer} />
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
              placeholder={`Message ${userName}...`}
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
            {actionMessage?.from_id === profile.id && (
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
