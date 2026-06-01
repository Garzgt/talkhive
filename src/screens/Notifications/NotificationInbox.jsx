import { useState, useCallback, useRef, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  fetchNotifications,
  markOneRead,
  markAllRead,
} from "./services/notificationService";
import { ROUTES } from "../../config/routes";
import { styles } from "./NotificationInbox.styles";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const TYPE_META = {
  join_request:      { icon: "🙋", wrapStyle: "iconWrapJoin" },
  request_approved:  { icon: "✅", wrapStyle: "iconWrapApproved" },
  new_dm:            { icon: "✉️", wrapStyle: "iconWrapDm" },
};

function NotificationCard({ item, onPress }) {
  const meta = TYPE_META[item.type] ?? { icon: "🔔", wrapStyle: "iconWrapDm" };
  return (
    <TouchableOpacity
      style={[styles.card, !item.is_read && styles.cardUnread]}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, styles[meta.wrapStyle]]}>
        <Text style={styles.iconText}>{meta.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.body ? <Text style={styles.cardMessage}>{item.body}</Text> : null}
        <Text style={styles.cardTime}>{timeAgo(item.created_at)}</Text>
      </View>
      {!item.is_read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

export default function NotificationInbox() {
  const { profile } = useAuth();
  const { refresh: refreshBadge } = useNotifications();
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);

  async function load() {
    if (!profile?.id) return;
    try {
      const data = await fetchNotifications(profile.id);
      setNotifications(data);
    } catch (_) {}
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [profile?.id])
  );

  const loadRef = useRef(load);
  useEffect(() => { loadRef.current = load; });

  useEffect(() => {
    if (!profile?.id) return;
    const channel = supabase
      .channel(`notif-inbox-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        () => loadRef.current()
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [profile?.id]);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function handlePress(item) {
    if (!item.is_read) {
      await markOneRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => n.id === item.id ? { ...n, is_read: true } : n)
      );
      refreshBadge();
    }
    navigateTo(item);
  }

  async function navigateTo(item) {
    const data = item.data ?? {};

    if ((item.type === "join_request" || item.type === "request_approved") && data.room_id) {
      try {
        const { data: room } = await supabase
          .from("rooms")
          .select("name")
          .eq("id", data.room_id)
          .single();
        const targetScreen = item.type === "join_request" ? ROUTES.ROOM_INFO : ROUTES.CHAT_ROOM;
        navigation.navigate(ROUTES.ROOMS, {
          screen: targetScreen,
          params: { roomId: data.room_id, roomName: room?.name ?? "" },
        });
      } catch (_) {}

    } else if (item.type === "new_dm" && data.from_id) {
      try {
        const { data: p } = await supabase
          .from("profiles")
          .select("display_name, username, avatar_url")
          .eq("id", data.from_id)
          .single();
        navigation.navigate(ROUTES.DM_INBOX, {
          screen: ROUTES.DM_CONVERSATION,
          params: {
            userId:     data.from_id,
            userName:   p?.display_name || p?.username || "User",
            userAvatar: p?.avatar_url ?? null,
          },
        });
      } catch (_) {}
    }
  }

  async function handleMarkAll() {
    if (!profile?.id) return;
    await markAllRead(profile.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    refreshBadge();
  }

  const hasUnread = notifications.some((n) => !n.is_read);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alerts</Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color="#F97316" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        {hasUnread ? (
          <TouchableOpacity onPress={handleMarkAll} hitSlop={8}>
            <Text style={styles.markAllBtn}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} onPress={handlePress} />}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Text style={{ fontSize: 32 }}>🔔</Text>
            </View>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
