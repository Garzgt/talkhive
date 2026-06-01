import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { fonts, fontSizes } from "../../../styles/fonts";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  card: {
    flexDirection:    "row",
    alignItems:       "center",
    backgroundColor:  colors.background,
    marginHorizontal: spacing.base,
    marginVertical:   5,
    paddingVertical:  spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius:     radius.xl,
    gap:              spacing.md,
    elevation:        2,
    shadowColor:      "#000",
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.07,
    shadowRadius:     4,
  },
  avatar: {
    width:          50,
    height:         50,
    borderRadius:   radius.lg,
    justifyContent: "center",
    alignItems:     "center",
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize:   fontSizes.xl,
    color:      "#fff",
  },
  info: {
    flex: 1,
    gap:  3,
  },
  topRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing.sm,
  },
  nameWrap: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
    flexShrink:    1,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.text,
    flexShrink: 1,
  },
  joinedBadge: {
    backgroundColor:   colors.successLight,
    borderRadius:      radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  joinedText: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.xs,
    color:      colors.success,
  },
  pendingBadge: {
    backgroundColor:   colors.warningLight,
    borderRadius:      radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  pendingText: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.xs,
    color:      colors.warning,
  },
  desc: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
    marginTop:     2,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      colors.textMuted,
  },
});
