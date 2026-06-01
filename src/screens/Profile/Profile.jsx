import { useState } from "react";
import {
  View, Text, TouchableOpacity, Image, Modal,
  TextInput, ScrollView, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { pickImage } from "../../utils/uploadImage";
import { updateProfile, uploadAvatar, changePassword } from "./services/profileService";
import { styles } from "./Profile.styles";

export default function Profile() {
  const { profile, session, signOut, fetchProfile } = useAuth();

  const [editing, setEditing]         = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio]                 = useState("");
  const [avatarAsset, setAvatarAsset] = useState(null);
  const [saving, setSaving]           = useState(false);

  const [pwModal, setPwModal]         = useState(false);
  const [currentPw, setCurrentPw]     = useState("");
  const [newPw, setNewPw]             = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [pwSaving, setPwSaving]       = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const displayNameShown = profile?.display_name || profile?.username || "User";
  const initials         = displayNameShown[0].toUpperCase();

  function startEdit() {
    setDisplayName(profile?.display_name || "");
    setBio(profile?.bio || "");
    setAvatarAsset(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setAvatarAsset(null);
  }

  async function handlePickAvatar() {
    try {
      const asset = await pickImage();
      if (asset) setAvatarAsset(asset);
    } catch (e) {
      Alert.alert("Error", e.message || "Could not open gallery.");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (avatarAsset) await uploadAvatar(profile.id, avatarAsset);
      await updateProfile(profile.id, { displayName, bio });
      await fetchProfile(profile.id);
      setEditing(false);
      setAvatarAsset(null);
    } catch (e) {
      Alert.alert("Error", e.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  function openPwModal() {
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setPwModal(true);
  }

  async function handleChangePassword() {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPw.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(session?.user?.email, currentPw, newPw);
      setPwModal(false);
      Alert.alert("Success", "Your password has been updated.");
    } catch (e) {
      Alert.alert("Error", e.message || "Could not change password.");
    } finally {
      setPwSaving(false);
    }
  }

  const avatarUri = avatarAsset?.uri || profile?.avatar_url;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {editing ? (
          <TouchableOpacity onPress={cancelEdit} hitSlop={10} disabled={saving}>
            <Text style={styles.headerAction}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <Text style={styles.headerTitle}>{editing ? "Edit Profile" : "Profile"}</Text>

        {editing ? (
          <TouchableOpacity onPress={handleSave} hitSlop={10} disabled={saving}>
            {saving
              ? <ActivityIndicator size="small" color="#F97316" />
              : <Text style={[styles.headerAction, styles.headerActionPrimary]}>Save</Text>
            }
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startEdit} hitSlop={10}>
            <Ionicons name="pencil-outline" size={20} color="#111827" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <TouchableOpacity
            onPress={editing ? handlePickAvatar : undefined}
            activeOpacity={editing ? 0.75 : 1}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarCircle} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{initials}</Text>
              </View>
            )}
            {editing && (
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          {editing && <Text style={styles.changePhotoHint}>Tap to change photo</Text>}
        </View>

        {editing ? (
          <View style={styles.form}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your display name"
              placeholderTextColor="#9CA3AF"
              maxLength={50}
              autoCorrect={false}
            />
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell people about yourself..."
              placeholderTextColor="#9CA3AF"
              maxLength={160}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/160</Text>
          </View>
        ) : (
          <View style={styles.info}>
            <Text style={styles.displayName}>{displayNameShown}</Text>
            <Text style={styles.username}>@{profile?.username}</Text>
            {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
          </View>
        )}
        </View>
      </ScrollView>

      {!editing && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={openPwModal} activeOpacity={0.8}>
            <Ionicons name="lock-closed-outline" size={20} color="#111827" />
            <Text style={styles.actionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Change Password Modal */}
      <Modal visible={pwModal} transparent animationType="slide" onRequestClose={() => setPwModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setPwModal(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Change Password</Text>

            <Text style={styles.label}>Current Password</Text>
            <View style={styles.pwField}>
              <TextInput
                style={styles.pwInput}
                value={currentPw}
                onChangeText={setCurrentPw}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowCurrent((v) => !v)} hitSlop={8}>
                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>New Password</Text>
            <View style={styles.pwField}>
              <TextInput
                style={styles.pwInput}
                value={newPw}
                onChangeText={setNewPw}
                placeholder="At least 6 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNew}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowNew((v) => !v)} hitSlop={8}>
                <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.pwField}>
              <TextInput
                style={styles.pwInput}
                value={confirmPw}
                onChangeText={setConfirmPw}
                placeholder="Repeat new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.pwSaveBtn, pwSaving && styles.pwSaveBtnDisabled]}
              onPress={handleChangePassword}
              disabled={pwSaving}
              activeOpacity={0.8}
            >
              {pwSaving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.pwSaveText}>Update Password</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.pwCancelBtn} onPress={() => setPwModal(false)}>
              <Text style={styles.pwCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
