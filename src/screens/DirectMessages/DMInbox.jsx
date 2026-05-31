import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../config/routes";
import { styles } from "./DMInbox.styles";
import DMConversationCard from "./components/DMConversationCard";
import { fetchConversations } from "./services/dmService";

export default function DMInbox({ navigation }) {
  const { profile }                     = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (!profile?.id) return;
    console.log("[DMInbox] loading conversations");
    if (isRefresh) setRefreshing(true);
    try {
      const data = await fetchConversations(profile.id);
      console.log("[DMInbox] got", data.length, "conversations");
      setConversations(data);
    } catch (e) {
      console.log("[DMInbox] error →", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  function openConversation(conv) {
    const userName   = conv.profile?.display_name || conv.profile?.username || "User";
    const userAvatar = conv.profile?.avatar_url || null;
    console.log("[DMInbox] opening conversation with:", userName);
    navigation.navigate(ROUTES.DM_CONVERSATION, {
      userId: conv.otherId, userName, userAvatar,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.composeBtn}
          onPress={() => navigation.getParent()?.navigate(ROUTES.SEARCH)}
          hitSlop={10}
        >
          <Ionicons name="create-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.centerWrap}>
          <Ionicons name="chatbubble-ellipses-outline" size={52} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyDesc}>Use the compose button to start a conversation.</Text>
        </View>
      ) : (
        <FlashList
          data={conversations}
          keyExtractor={(item) => item.otherId}
          renderItem={({ item }) => (
            <DMConversationCard conversation={item} onPress={() => openConversation(item)} />
          )}
          estimatedItemSize={74}
          onRefresh={() => load(true)}
          refreshing={refreshing}
        />
      )}
    </SafeAreaView>
  );
}
