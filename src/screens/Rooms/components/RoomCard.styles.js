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
    marginVertical:   spacing.xs,
    padding:          spacing.md,
    borderRadius:     radius.lg,
    borderWidth:      1,
    borderColor:      colors.border,
    gap:              spacing.md,
  },
  avatar: {
    width:           48,
    height:          48,
    borderRadius:    radius.md,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
  },
  info: {
    flex: 1,
    gap:  3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing.sm,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.text,
    flexShrink: 1,
  },
  badge: {
    backgroundColor:   colors.successLight,
    borderRadius:      radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize:   fontSizes.xs,
    color:      colors.success,
  },
  pendingBadge: {
    backgroundColor:   colors.warningLight,
    borderRadius:      radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  pendingBadgeText: {
    fontFamily: fonts.medium,
    fontSize:   fontSizes.xs,
    color:      colors.warning,
  },
  desc: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.textSecondary,
    lineHeight: fontSizes.sm * 1.4,
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
