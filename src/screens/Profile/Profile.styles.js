import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["2xl"],
  },
  header: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  displayName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: colors.textMuted,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginTop: "auto",
    marginBottom: spacing["2xl"],
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.error,
  },
});
