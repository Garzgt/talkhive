import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header bar
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginRight: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
    borderRadius: 4,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },

  // Icon section
  iconSection: {
    alignItems: "center",
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["2xl"],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  // Heading
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing["2xl"],
  },

  // Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.error,
    lineHeight: 18,
  },

  // Field
  fieldGroup: { marginBottom: spacing.base },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  inputError: { borderColor: colors.error },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 5,
  },

  // Primary button
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textInverse,
    letterSpacing: 0.4,
  },

  // Code input
  codeInput: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 10,
  },
  resendText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
    marginTop: spacing.md,
    textAlign: "center",
  },
  resendBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
  },
  resendBannerText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: "600",
  },

  // Password row with eye toggle
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  eyeBtn: {
    padding: spacing.sm,
    paddingRight: spacing.base,
  },

  // Success state
  successSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.successLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing["3xl"],
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
});
