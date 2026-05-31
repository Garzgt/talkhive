import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { fonts, fontSizes } from "../../../styles/fonts";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: spacing.base,
    paddingVertical:   spacing.md,
    gap:               spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width:           46,
    height:          46,
    borderRadius:    radius.full,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
  },
  initials: {
    fontFamily: fonts.bold,
    fontSize:   fontSizes.md,
    color:      "#fff",
  },
  onlineDot: {
    position:        "absolute",
    bottom:          1,
    right:           1,
    width:           12,
    height:          12,
    borderRadius:    6,
    backgroundColor: colors.online,
    borderWidth:     2,
    borderColor:     colors.background,
  },
  info: {
    flex: 1,
    gap:  2,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.text,
  },
  username: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.textMuted,
  },
});
