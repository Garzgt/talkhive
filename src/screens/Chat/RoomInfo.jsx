import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../config/supabase";
import { leaveRoom, fetchPendingRequests, approveRequest, rejectRequest, kickMember } from "../Rooms/services/roomService";
import { styles } from "./RoomInfo.styles";

export default function RoomInfo({ navigation, route }) {
  const { roomId, roomName } = route.params;
  const { profile }          = useAuth();

  const [room, setRoom]         = useState(null);
  const [members, setMembers]   = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [leaving, setLeaving]   = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: roomData }, { data: memberData }] = await Promise.all([
        supabase.from("rooms").select("*").eq("id", roomId).single(),
        supabase
          .from("room_members")
          .select("*, profiles!room_members_user_id_fkey(id, username, display_name)")
          .eq("room_id", roomId)
          .eq("status", "approved"),
      ]);
      setRoom(roomData);
      const mems = memberData || [];
      setMembers(mems);

      const myMem = mems.find((m) => m.user_id === profile.id);
      if (myMem?.role === "owner") {
        const reqs = await fetchPendingRequests(roomId);
        setRequests(reqs);
      }
      setLoading(false);
    }
    load();
  }, [roomId]);

  const myMembership = members.find((m) => m.user_id === profile.id);
  const isOwner      = myMembership?.role === "owner";

  async function handleApprove(req) {
    try {
      await approveRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      setMembers((prev) => [...prev, { ...req, status: "approved", role: "member" }]);
    } catch (e) {
      Alert.alert("Error", e.message || "Could not approve request.");
    }
  }

  function handleKick(member) {
    const name = member.profiles?.display_name || member.profiles?.username || "this member";
    Alert.alert("Remove Member", `Remove ${name} from this room?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await kickMember(member.id);
            setMembers((prev) => prev.filter((m) => m.id !== member.id));
          } catch (e) {
            Alert.alert("Error", e.message || "Could not remove member.");
          }
        },
      },
    ]);
  }

  function handleReject(req) {
    const name = req.profiles?.display_name || req.profiles?.username || "this user";
    Alert.alert("Reject Request", `Reject ${name}'s request?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          try {
            await rejectRequest(req.id);
            setRequests((prev) => prev.filter((r) => r.id !== req.id));
          } catch (e) {
            Alert.alert("Error", e.message || "Could not reject request.");
          }
        },
      },
    ]);
  }

  function confirmLeave() {
    Alert.alert("Leave Room", `Leave ${roomName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          setLeaving(true);
          try {
            await leaveRoom(roomId, profile.id);
            navigation.popToTop();
          } catch (e) {
            Alert.alert("Error", e.message || "Could not leave room.");
            setLeaving(false);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Room Info</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <View style={styles.avatar}>
              <Ionicons name="chatbubbles" size={36} color="#fff" />
            </View>

            <Text style={styles.name}>{room?.name}</Text>

            {room?.description ? (
              <Text style={styles.desc}>{room.description}</Text>
            ) : null}

            <View style={styles.statRow}>
              <Ionicons name="people-outline" size={18} color="#6B7280" />
              <Text style={styles.statText}>
                {members.length} member{members.length !== 1 ? "s" : ""}
              </Text>
            </View>

            {isOwner && (
              <View style={styles.ownerBadge}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#F97316" />
                <Text style={styles.ownerText}>You own this room</Text>
              </View>
            )}
          </View>

          {isOwner && (
            <View style={styles.requestsSection}>
              <Text style={styles.sectionTitle}>Members ({members.length})</Text>
              {members.map((m) => {
                const isMe = m.user_id === profile.id;
                const name = m.profiles?.display_name || m.profiles?.username || "Unknown";
                return (
                  <View key={m.id} style={styles.requestRow}>
                    <View style={styles.requestAvatar}>
                      <Text style={styles.requestInitial}>{name[0].toUpperCase()}</Text>
                    </View>
                    <Text style={styles.requestName} numberOfLines={1}>
                      {name}{isMe ? " (you)" : ""}
                    </Text>
                    {!isMe && (
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleKick(m)}>
                        <Ionicons name="person-remove-outline" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {isOwner && (
            <View style={styles.requestsSection}>
              <Text style={styles.sectionTitle}>
                Join Requests{requests.length > 0 ? ` (${requests.length})` : ""}
              </Text>
              {requests.length === 0 ? (
                <Text style={styles.noRequests}>No pending requests</Text>
              ) : (
                requests.map((req) => (
                  <View key={req.id} style={styles.requestRow}>
                    <View style={styles.requestAvatar}>
                      <Text style={styles.requestInitial}>
                        {(req.profiles?.display_name || req.profiles?.username || "?")[0].toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.requestName} numberOfLines={1}>
                      {req.profiles?.display_name || req.profiles?.username}
                    </Text>
                    <View style={styles.requestActions}>
                      <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(req)}>
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(req)}>
                        <Ionicons name="close" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {!isOwner && (
            <TouchableOpacity
              style={[styles.leaveBtn, leaving && styles.leaveBtnDisabled]}
              onPress={confirmLeave}
              activeOpacity={0.8}
              disabled={leaving}
            >
              {leaving ? (
                <ActivityIndicator color="#DC2626" />
              ) : (
                <>
                  <Ionicons name="exit-outline" size={18} color="#DC2626" />
                  <Text style={styles.leaveText}>Leave Room</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
