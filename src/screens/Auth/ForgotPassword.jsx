import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { sendOtpCode, verifyOtpCode, resetPasswordWithOtp } from "./services/authService";
import AlertModal from "./components/AlertModal";
import { colors } from "../../styles/colors";
import { isValidEmail } from "../../utils/validation";
import { styles } from "./ForgotPassword.styles";

export default function ForgotPassword({ navigation }) {
  const [step,            setStep]            = useState(1);
  const [email,           setEmail]           = useState("");
  const [code,            setCode]            = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [focusedField,    setFocusedField]    = useState(null);
  const [success,         setSuccess]         = useState(false);

  // ── Step 1: Send OTP via Brevo ───────────────────────────────
  const handleSendCode = async () => {
    setError("");
    if (!email.trim())        { setError("Email is required"); return; }
    if (!isValidEmail(email)) { setError("Enter a valid email"); return; }
    setLoading(true);
    try {
      await sendOtpCode(email);
      setStep(2);
    } catch (e) {
      if (e.message === "EMAIL_NOT_FOUND") {
        setError("No account found with that email address.");
      } else {
        setError(e.message || "Could not send code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────
  const handleVerifyCode = async () => {
    setError("");
    if (code.length !== 6) { setError("Enter the 6-digit code from your email"); return; }
    setLoading(true);
    try {
      await verifyOtpCode(email, code);
      setStep(3);
    } catch (e) {
      if (e.message === "EXPIRED_CODE") {
        setError("expired");
      } else {
        setError("That code is incorrect. Please double-check and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ───────────────────────────────────
  const handleResetPassword = async () => {
    setError("");
    if (!password)                    { setError("Password is required"); return; }
    if (password.length < 8)          { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await resetPasswordWithOtp(email, code, password);
      setSuccess(true);
    } catch (e) {
      setError(e.message || "Could not reset password. Please try again.");
      setLoading(false);
    }
  };

  const STEP_CONFIG = [
    { icon: "mail-outline",        title: "Forgot password?",  subtitle: "Enter your email and we'll send you a 6-digit code." },
    { icon: "keypad-outline",      title: "Enter the code",    subtitle: `We sent a 6-digit code to ${email}` },
    { icon: "lock-closed-outline", title: "New password",      subtitle: "Choose a strong password for your account." },
  ];
  const cfg = STEP_CONFIG[step - 1];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step > 1) { setStep((s) => s - 1); setError(""); }
            else navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.dotsRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.dot, step === s && styles.dotActive]} />
          ))}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons name={cfg.icon} size={36} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.formTitle}>{cfg.title}</Text>
          <Text style={styles.formSubtitle}>{cfg.subtitle}</Text>

          {error && error !== "expired" ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* ── Step 1: Email ── */}
          {step === 1 && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={[styles.input, focusedField === "email" && styles.inputFocused, error && styles.inputError]}
                value={email}
                onChangeText={(v) => { setEmail(v); setError(""); }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {/* ── Step 2: OTP Code ── */}
          {step === 2 && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>6-digit code</Text>
              <TextInput
                style={[styles.input, styles.codeInput, focusedField === "code" && styles.inputFocused, error && error !== "expired" && styles.inputError]}
                value={code}
                onChangeText={(v) => { setCode(v.replace(/\D/g, "")); setError(""); }}
                onFocus={() => setFocusedField("code")}
                onBlur={() => setFocusedField(null)}
                placeholder="000000"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                editable={error !== "expired"}
              />
              {error === "expired" ? (
                <TouchableOpacity
                  style={styles.resendBanner}
                  onPress={() => { setCode(""); setError(""); handleSendCode(); }}
                  disabled={loading}
                >
                  <Ionicons name="refresh-outline" size={16} color={colors.primary} />
                  <Text style={styles.resendBannerText}>Code expired — tap to send a new one</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => { setCode(""); setError(""); handleSendCode(); }}>
                  <Text style={styles.resendText}>Didn't get it? Resend code</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── Step 3: New password ── */}
          {step === 3 && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>New password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.passwordInput, focusedField === "password" && styles.inputFocused]}
                    value={password}
                    onChangeText={(v) => { setPassword(v); setError(""); }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Min. 8 characters"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.passwordInput, focusedField === "confirm" && styles.inputFocused]}
                    value={confirmPassword}
                    onChangeText={(v) => { setConfirmPassword(v); setError(""); }}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Re-enter your password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
                    <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={step === 1 ? handleSendCode : step === 2 ? handleVerifyCode : handleResetPassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.primaryBtnText}>
                  {step === 1 ? "Send Code" : step === 2 ? "Verify Code" : "Reset Password"}
                </Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={success}
        type="success"
        title="Password Reset!"
        message="Your password has been updated successfully. Sign in with your new password."
        onClose={() => {
          setSuccess(false);
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }}
      />
    </SafeAreaView>
  );
}
