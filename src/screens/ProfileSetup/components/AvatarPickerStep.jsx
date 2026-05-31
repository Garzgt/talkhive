import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../../styles/colors";
import { styles } from "./AvatarPickerStep.styles";

export default function AvatarPickerStep({ initials, avatarUri, onAvatarSelected, onFinish, onSkip, loading }) {
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) onAvatarSelected(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) onAvatarSelected(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      {/* Tappable avatar circle */}
      <TouchableOpacity onPress={pickFromGallery} activeOpacity={0.85} style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarInitial}>{initials}</Text>
          )}
        </View>
        <View style={styles.cameraOverlay}>
          <Ionicons name="camera" size={16} color="#fff" />
        </View>
      </TouchableOpacity>

      <Text style={styles.heading}>Add a profile photo</Text>
      <Text style={styles.subheading}>Help your friends recognize you</Text>

      <TouchableOpacity style={styles.optionBtn} onPress={pickFromGallery} activeOpacity={0.8}>
        <View style={styles.optionIcon}>
          <Ionicons name="images-outline" size={20} color={colors.primary} />
        </View>
        <Text style={styles.optionText}>Choose from Gallery</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionBtn} onPress={takePhoto} activeOpacity={0.8}>
        <View style={styles.optionIcon}>
          <Ionicons name="camera-outline" size={20} color={colors.primary} />
        </View>
        <Text style={styles.optionText}>Take a Photo</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {avatarUri && (
        <TouchableOpacity
          style={[styles.finishBtn, loading && styles.finishBtnDisabled]}
          onPress={onFinish}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.finishBtnText}>Save & Continue</Text>
          }
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={onSkip} disabled={loading}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}
