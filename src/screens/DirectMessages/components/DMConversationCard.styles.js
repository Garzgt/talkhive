import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { fonts, fontSizes } from "../../../styles/fonts";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    backgroundColor:   colors.background,
    marginHorizontal:  spacing.base,
    marginVertical:    5,
    paddingVertical:   spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius:      radius.xl,
    gap:               spacing.md,
    elevation:         2,
    shadowColor:       "#000",
    shadowOffset:      { width: 0, height: 1 },
    shadowOpacity:     0.07,
    shadowRadius:      4,
  },
  avatarWrap: {
    width:  50,
    height: 50,
  },
  avatarImage: {
    width:        50,
    height:       50,
    borderRadius: radius.full,
  },
  avatarPlaceholder: {
    width:           50,
    height:          50,
    borderRadius:    radius.full,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
  },
  initials: {
    fontFamily: fonts.bold,
    fontSize:   fontSizes.lg,
    color:      "#fff",
  },
  onlineDot: {
    position:        "absolute",
    bottom:          1,
    right:           1,
    width:           13,
    height:          13,
    borderRadius:    7,
    backgroundColor: colors.online,
    borderWidth:     2,
    borderColor:     colors.background,
  },
  info: {
    flex: 1,
    gap:  4,
  },
  topRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  name: {
    fontFamily: fonts.medium,
    fontSize:   fontSizes.base,
    color:      colors.text,
    flex:       1,
  },
  nameBold: {
    fontFamily: fonts.semiBold,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      colors.textMuted,
    marginLeft: spacing.sm,
  },
  bottomRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  preview: {
    flex:       1,
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.textSecondary,
  },
  previewBold: {
    fontFamily: fonts.medium,
    color:      colors.text,
  },
  badge: {
    minWidth:          20,
    height:            20,
    borderRadius:      10,
    backgroundColor:   colors.primary,
    justifyContent:    "center",
    alignItems:        "center",
    paddingHorizontal: 5,
    marginLeft:        spacing.sm,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize:   10,
    color:      "#fff",
  },
});
