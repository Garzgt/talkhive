import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { fonts, fontSizes } from "../../../styles/fonts";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    paddingHorizontal: spacing.base,
    paddingVertical:   spacing.sm,
    gap:               spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.xs + 2,
    borderRadius:      radius.full,
    borderWidth:       1.5,
    borderColor:       colors.border,
    backgroundColor:   colors.background,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor:     colors.primary,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize:   fontSizes.sm,
    color:      colors.textSecondary,
  },
  labelActive: {
    color: colors.textInverse,
  },
});
