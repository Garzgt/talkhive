import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { spacing } from "./spacing";

export const common = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  padding: {
    padding: spacing.base,
  },
  paddingH: {
    paddingHorizontal: spacing.base,
  },
  paddingV: {
    paddingVertical: spacing.base,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
