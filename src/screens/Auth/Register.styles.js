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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },

  // Brand
  brandSection: {
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -1,
  },
  logoDot: { color: colors.primaryDark },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Heading
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  // Fields
  fieldGroup: { marginBottom: spacing.md },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },

  // Icon input row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  inputRowFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  inputRowError: { borderColor: colors.error },
  inputField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  eyeBtn: { padding: spacing.xs },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 5,
  },

  // Match indicator
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 5,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Primary button
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  primaryBtnDisabled: { opacity: 0.65, elevation: 0, shadowOpacity: 0 },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textInverse,
    letterSpacing: 0.4,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.primary, fontWeight: "700" },
});
