import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing["2xl"],
  },
  card: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.xl,
    alignItems: "center",
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing["2xl"],
  },
  btn: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textInverse,
    letterSpacing: 0.3,
  },
});
