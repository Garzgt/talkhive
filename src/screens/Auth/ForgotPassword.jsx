import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordReset } from "./services/authService";
import { colors } from "../../styles/colors";
import { isValidEmail } from "../../utils/validation";
import { styles } from "./ForgotPassword.styles";

export default function ForgotPassword({ navigation }) {
  const [email,        setEmail]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [sent,         setSent]         = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [fieldError,   setFieldError]   = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    if (!email.trim())         { setFieldError("Email is required"); return false; }
    if (!isValidEmail(email))  { setFieldError("Enter a valid email"); return false; }
    setFieldError("");
    return true;
  };

  const handleSend = async () => {
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (e) {
      setApiError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ────────────────────────────────────────────
  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-circle" size={52} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Email sent!</Text>
          <Text style={styles.successSubtitle}>
            Check your inbox for a password reset link.{"\n"}
            It may take a minute to arrive.
          </Text>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.outlineBtnText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Default state ────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
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
          {/* Icon */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed-outline" size={36} color={colors.primary} />
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.formTitle}>Forgot password?</Text>
          <Text style={styles.formSubtitle}>
            Enter the email address linked to your account and we'll send you a reset link.
          </Text>

          {/* API error */}
          {apiError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={styles.errorBannerText}>{apiError}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
                fieldError              && styles.inputError,
              ]}
              value={email}
              onChangeText={(v) => { setEmail(v); setFieldError(""); }}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {fieldError ? (
              <Text style={styles.fieldError}>{fieldError}</Text>
            ) : null}
          </View>

          {/* Send button */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleSend}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.primaryBtnText}>Send Reset Link</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
