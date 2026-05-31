import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { fonts, fontSizes } from "../../styles/fonts";
import { spacing } from "../../styles/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: spacing.base,
    paddingVertical:   spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize:   fontSizes.xl,
    color:      colors.text,
  },
  composeBtn: {
    padding: spacing.xs,
  },
  centerWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
    gap:            spacing.md,
    paddingBottom:  spacing["5xl"],
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.textSecondary,
  },
  emptyDesc: {
    fontFamily:        fonts.regular,
    fontSize:          fontSizes.sm,
    color:             colors.textMuted,
    textAlign:         "center",
    paddingHorizontal: spacing["2xl"],
  },
});
