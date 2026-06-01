import { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import AlertModal from "../Auth/components/AlertModal";
import sessionFlags from "../../state/sessionFlags";
import { ROUTES } from "../../config/routes";
import { styles } from "./RoomList.styles";
import RoomCard from "./components/RoomCard";
import RoomFilterTabs from "./components/RoomFilterTabs";
import CreateRoomModal from "./components/CreateRoomModal";
import { fetchRooms, createRoom, joinRoom } from "./services/roomService";
import { subscribeToRoomList } from "./services/roomRealtimeService";

export default function RoomList({ navigation }) {
  const { profile } = useAuth();

  const [welcome, setWelcome]             = useState({ visible: false, title: "", message: "" });
  const [rooms, setRooms]                 = useState([]);
  const [filter, setFilter]               = useState("all");
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [alert, setAlert]                 = useState({ visible: false, type: "error", title: "", message: "" });
  const searchRef                         = useRef(null);

  useEffect(() => {
    if (sessionFlags.showWelcome) {
      sessionFlags.showWelcome = false;
      setWelcome({
        visible: true,
        title:   "Welcome to TalkHive!",
        message: `Hey ${profile?.display_name || profile?.username || "there"}, your account is all set. Start exploring rooms and connect with your hive.`,
      });
    } else if (sessionFlags.showLoginWelcome) {
      sessionFlags.showLoginWelcome = false;
      const name       = profile?.display_name || profile?.username || "there";
      const createdAt  = profile?.created_at ? new Date(profile.created_at) : null;
      const ageMinutes = createdAt ? (Date.now() - createdAt.getTime()) / 60000 : null;
      const isNew      = ageMinutes !== null && ageMinutes < 5;
      setWelcome({
        visible: true,
        title:   isNew ? "Welcome to TalkHive!" : "Welcome back!",
        message: isNew
          ? `Hey ${name}, your account is all set. Start exploring rooms and connect with your hive.`
          : `Good to see you again, ${name}.`,
      });
    }
  }, []);

  const loadRooms = useCallback(async (isRefresh = false) => {
    if (!profile?.id) return;
    if (isRefresh) setRefreshing(true);
    try {
      const data = await fetchRooms(profile.id, filter);
      setRooms(data);
    } catch (e) {
      setAlert({ visible: true, type: "error", title: "Error", message: e.message || "Failed to load rooms." });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile?.id, filter]);

  const loadRoomsRef = useRef(loadRooms);
  useEffect(() => { loadRoomsRef.current = loadRooms; }, [loadRooms]);

  useEffect(() => {
    if (!profile?.id) return;
    return subscribeToRoomList(profile.id, () => loadRoomsRef.current());
  }, [profile?.id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadRooms();
    }, [loadRooms])
  );

  function toggleSearch() {
    if (searchVisible) {
      setSearchQuery("");
      setSearchVisible(false);
    } else {
      setSearchVisible(true);
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }

  const filteredRooms = searchQuery.trim()
    ? rooms.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rooms;

  async function handleCreate(name, description) {
    const room = await createRoom(profile.id, name, description);
    loadRooms();
    return room;
  }

  async function handleJoin(room) {
    if (room.is_joined) {
      navigation.navigate(ROUTES.CHAT_ROOM, { roomId: room.id, roomName: room.name });
      return;
    }
    if (room.is_pending) {
      setAlert({ visible: true, type: "warning", title: "Request Pending", message: "Your join request is waiting for the room owner to approve it." });
      return;
    }
    try {
      await joinRoom(room.id, profile.id);
      setAlert({ visible: true, type: "success", title: "Request Sent", message: `Your request to join "${room.name}" has been sent to the owner.` });
      loadRooms();
    } catch (e) {
      setAlert({ visible: true, type: "error", title: "Error", message: e.message || "Could not send join request." });
    }
  }

  function renderEmpty() {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="chatbubbles-outline" size={36} color="#D1D5DB" />
        </View>
        <Text style={styles.emptyTitle}>
          {searchQuery.trim()
            ? `No rooms match "${searchQuery}"`
            : filter === "joined" ? "No rooms joined yet" : "No rooms yet"}
        </Text>
        <Text style={styles.emptyDesc}>
          {searchQuery.trim()
            ? "Try a different search term."
            : filter === "joined"
              ? "Join a room from the All tab to get started."
              : "Be the first to create a room!"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rooms</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSearch} hitSlop={10}>
            <Ionicons
              name={searchVisible ? "close-outline" : "search-outline"}
              size={22}
              color="#111827"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setCreateVisible(true)}
            hitSlop={10}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {searchVisible && (
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="#9CA3AF" />
          <TextInput
            ref={searchRef}
            style={styles.searchInput}
            placeholder="Search rooms..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={10}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <RoomFilterTabs active={filter} onChange={setFilter} />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : (
        <FlashList
          data={filteredRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RoomCard room={item} onPress={() => handleJoin(item)} />
          )}
          estimatedItemSize={88}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          onRefresh={() => loadRooms(true)}
          refreshing={refreshing}
        />
      )}

      <CreateRoomModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={handleCreate}
      />

      <AlertModal
        visible={welcome.visible}
        type="success"
        title={welcome.title}
        message={welcome.message}
        onClose={() => setWelcome((w) => ({ ...w, visible: false }))}
      />

      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert((a) => ({ ...a, visible: false }))}
      />
    </SafeAreaView>
  );
}
