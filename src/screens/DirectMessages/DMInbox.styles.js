import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { fonts, fontSizes } from "../../styles/fonts";
import { spacing, radius } from "../../styles/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: spacing.base,
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.md,
    backgroundColor:   colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize:   fontSizes.xl,
    color:      colors.text,
  },
  composeBtn: {
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
  },
  centerWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
    gap:            spacing.md,
    paddingBottom:  spacing["5xl"],
  },
  emptyIconWrap: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: colors.surfaceAlt,
    justifyContent:  "center",
    alignItems:      "center",
    marginBottom:    spacing.sm,
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
    lineHeight:        fontSizes.sm * 1.6,
  },
});
