import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signUp } from "./services/authService";
import { ROUTES } from "../../config/routes";
import sessionFlags from "../../state/sessionFlags";
import { colors } from "../../styles/colors";
import { isValidEmail, isValidUsername } from "../../utils/validation";
import PasswordStrengthBar from "./components/PasswordStrengthBar";
import AlertModal from "./components/AlertModal";
import { styles } from "./Register.styles";

export default function Register({ navigation }) {
  const [username,        setUsername]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [fieldErrors,     setFieldErrors]     = useState({});
  const [focusedField,    setFocusedField]    = useState(null);
  const [modal,           setModal]           = useState({ visible: false, title: "", message: "" });

  const clearFieldError = (field) =>
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));

  const showError = (title, message) =>
    setModal({ visible: true, title, message });

  const validate = () => {
    const errs = {};
    if (!username.trim())               errs.username = "Username is required";
    else if (!isValidUsername(username)) errs.username = "3–20 chars, letters, numbers, underscores";
    if (!email.trim())                  errs.email    = "Email is required";
    else if (!isValidEmail(email))      errs.email    = "Enter a valid email";
    if (!password)                      errs.password = "Password is required";
    else if (password.length < 8)       errs.password = "At least 8 characters";
    if (!confirmPassword)               errs.confirm  = "Please confirm your password";
    else if (confirmPassword !== password) errs.confirm = "Passwords do not match";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(email, password, username);
      sessionFlags.showWelcome = true;
    } catch (e) {
      const msg = (e.message ?? "").toLowerCase();
      const isDuplicateEmail =
        msg.includes("already registered") ||
        msg.includes("already exists") ||
        msg.includes("already in use") ||
        msg.includes("email address is already") ||
        msg.includes("user already");
      const isRateLimit =
        msg.includes("rate limit") ||
        msg.includes("over_email_send_rate_limit") ||
        msg.includes("too many requests") ||
        msg.includes("for security purposes");
      if (isRateLimit) {
        showError(
          "Too Many Attempts",
          "You've hit Supabase's email limit. Please wait a minute and try again, or use a different email address."
        );
      } else if (isDuplicateEmail) {
        showError(
          "Email Already Registered",
          "An account with this email already exists.\n\nTry signing in instead, or use a different email address."
        );
      } else if (msg.includes("password")) {
        showError("Weak Password", e.message);
      } else if (msg.includes("invalid email") || msg.includes("email is invalid")) {
        showError("Invalid Email", "Please enter a valid email address.");
      } else {
        showError("Registration Failed", e.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputRowStyle = (field) => [
    styles.inputRow,
    focusedField === field && styles.inputRowFocused,
    fieldErrors[field]    && styles.inputRowError,
  ];

  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header bar */}
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
          {/* Brand */}
          <View style={styles.brandSection}>
            <Text style={styles.logo}>
              Talk<Text style={styles.logoDot}>Hive</Text>
            </Text>
            <Text style={styles.tagline}>Join the hive today</Text>
          </View>

          <Text style={styles.formTitle}>Create account</Text>
          <Text style={styles.formSubtitle}>Fill in the details below to get started</Text>

          {/* Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={inputRowStyle("username")}>
              <Ionicons
                name="at-outline"
                size={18}
                color={focusedField === "username" ? colors.primary : colors.textMuted}
              />
              <TextInput
                style={styles.inputField}
                value={username}
                onChangeText={(v) => { setUsername(v); clearFieldError("username"); }}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. johndoe"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {fieldErrors.username
              ? <Text style={styles.fieldError}>{fieldErrors.username}</Text>
              : <Text style={styles.hint}>3–20 chars · letters, numbers, underscores</Text>
            }
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={inputRowStyle("email")}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={focusedField === "email" ? colors.primary : colors.textMuted}
              />
              <TextInput
                style={styles.inputField}
                value={email}
                onChangeText={(v) => { setEmail(v); clearFieldError("email"); }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {fieldErrors.email ? (
              <Text style={styles.fieldError}>{fieldErrors.email}</Text>
            ) : null}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={inputRowStyle("password")}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={focusedField === "password" ? colors.primary : colors.textMuted}
              />
              <TextInput
                style={styles.inputField}
                value={password}
                onChangeText={(v) => { setPassword(v); clearFieldError("password"); }}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Min. 8 characters"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.password ? (
              <Text style={styles.fieldError}>{fieldErrors.password}</Text>
            ) : null}
            <PasswordStrengthBar password={password} />
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={inputRowStyle("confirm")}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={
                  passwordsMatch    ? colors.success :
                  passwordsMismatch ? colors.error   :
                  focusedField === "confirm" ? colors.primary : colors.textMuted
                }
              />
              <TextInput
                style={styles.inputField}
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); clearFieldError("confirm"); }}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Live match / mismatch feedback */}
            {fieldErrors.confirm ? (
              <Text style={styles.fieldError}>{fieldErrors.confirm}</Text>
            ) : passwordsMatch ? (
              <View style={styles.matchRow}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[styles.matchText, { color: colors.success }]}>Passwords match</Text>
              </View>
            ) : passwordsMismatch ? (
              <View style={styles.matchRow}>
                <Ionicons name="close-circle" size={14} color={colors.error} />
                <Text style={[styles.matchText, { color: colors.error }]}>Passwords do not match</Text>
              </View>
            ) : null}
          </View>

          {/* Create Account button */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.primaryBtnText}>Create Account</Text>
            }
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Error popup */}
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
