import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: spacing["2xl"],
  },
  logo: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -1,
  },
  dot: {
    color: colors.primaryDark,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
