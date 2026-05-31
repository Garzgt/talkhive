import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signIn } from "./services/authService";
import { ROUTES } from "../../config/routes";
import sessionFlags from "../../state/sessionFlags";
import { colors } from "../../styles/colors";
import { isValidEmail } from "../../utils/validation";
import AlertModal from "./components/AlertModal";
import { styles } from "./Login.styles";

export default function Login({ navigation, route }) {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [modal,        setModal]        = useState(
    route?.params?.resetSuccess
      ? { visible: true, title: "Password Updated!", message: "Your password has been reset. Sign in with your new password." }
      : { visible: false, title: "", message: "" }
  );

  const clearFieldError = (field) =>
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));

  const showError = (title, message) =>
    setModal({ visible: true, title, message });

  const validate = () => {
    const errs = {};
    if (!email.trim())            errs.email    = "Email is required";
    else if (!isValidEmail(email)) errs.email   = "Enter a valid email";
    if (!password)                errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(email, password);
      sessionFlags.showLoginWelcome = true;
    } catch (e) {
      const msg = e.message ?? "";
      if (msg.toLowerCase().includes("invalid login")) {
        showError("Incorrect Credentials", "The email or password you entered is incorrect. Please try again.");
      } else if (msg.toLowerCase().includes("email not confirmed")) {
        showError("Email Not Verified", "Please check your inbox and verify your email before signing in.");
      } else {
        showError("Login Failed", msg || "Something went wrong. Please try again.");
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

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Orange header ── */}
            <View style={styles.header}>
              <Text style={styles.logo}>
                Talk<Text style={styles.logoDot}>Hive</Text>
              </Text>
              <Text style={styles.tagline}>Connect with your hive</Text>
            </View>

            {/* ── White form card ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardSubtitle}>Sign in to your account</Text>

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
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword((v) => !v)}
                  >
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
              </View>

              {/* Forgot password */}
              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Sign In button */}
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.primaryBtnText}>Sign In</Text>
                }
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Register link */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                  <Text style={styles.footerLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <AlertModal
        visible={modal.visible}
        type={route?.params?.resetSuccess && modal.visible ? "success" : "error"}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, visible: false }))}
      />
    </View>
  );
}
