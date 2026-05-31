import { useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, uploadAvatar } from "./services/profileSetupService";
import UsernameStep from "./components/UsernameStep";
import AvatarPickerStep from "./components/AvatarPickerStep";
import AlertModal from "../Auth/components/AlertModal";
import { styles } from "./ProfileSetup.styles";

const TOTAL_STEPS = 2;

export default function ProfileSetup() {
  const { session, profile, fetchProfile } = useAuth();

  const [step,        setStep]        = useState(1);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [avatarUri,   setAvatarUri]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [modal,       setModal]       = useState({ visible: false, title: "", message: "" });

  const userId   = session?.user?.id;
  const username = profile?.username ?? session?.user?.user_metadata?.username ?? "";
  const initials = (displayName || username || "?")[0].toUpperCase();

  const showError = (title, message) => setModal({ visible: true, title, message });

  const handleContinue = async () => {
    if (!displayName.trim()) return;
    setLoading(true);
    try {
      await updateProfile(userId, { display_name: displayName.trim() });
      setStep(2);
    } catch (e) {
      showError("Error", e.message || "Could not save your name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      if (avatarUri) {
        const publicUrl = await uploadAvatar(userId, avatarUri);
        await updateProfile(userId, { avatar_url: publicUrl });
      }
      await fetchProfile(userId);
    } catch (e) {
      showError("Upload Failed", e.message || "Could not upload your photo. Please try again.");
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await fetchProfile(userId);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = `${(step / TOTAL_STEPS) * 100}%`;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressPercent }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <UsernameStep
              username={username}
              displayName={displayName}
              onChangeDisplayName={setDisplayName}
              onContinue={handleContinue}
              loading={loading}
            />
          ) : (
            <AvatarPickerStep
              initials={initials}
              avatarUri={avatarUri}
              onAvatarSelected={setAvatarUri}
              onFinish={handleFinish}
              onSkip={handleSkip}
              loading={loading}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={modal.visible}
        type="error"
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, visible: false }))}
      />
    </SafeAreaView>
  );
}
