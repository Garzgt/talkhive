import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Root
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  safe: {
    flex: 1,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },

  // Orange header
  header: {
    alignItems: "center",
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["4xl"],
    paddingHorizontal: spacing.xl,
  },
  logo: {
    fontSize: 44,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  logoDot: {
    color: "rgba(255,255,255,0.7)",
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: spacing.xs,
    letterSpacing: 0.3,
  },

  // White form card
  card: {
    flex: 1,
    minHeight: height * 0.65,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: spacing["2xl"],
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
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
  inputRowError: {
    borderColor: colors.error,
  },
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

  // Forgot
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  forgotText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },

  // Primary button
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
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

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, color: colors.textMuted, fontWeight: "500" },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.primary, fontWeight: "700" },
});
