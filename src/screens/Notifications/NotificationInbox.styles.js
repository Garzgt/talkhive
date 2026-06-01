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
    alignItems:        "center",
    justifyContent:    "space-between",
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
  markAllBtn: {
    fontFamily: fonts.medium,
    fontSize:   fontSizes.sm,
    color:      colors.primary,
  },
  listContent: {
    paddingTop:    spacing.sm,
    paddingBottom: spacing["2xl"],
  },
  card: {
    flexDirection:     "row",
    alignItems:        "flex-start",
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
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  iconWrap: {
    width:          44,
    height:         44,
    borderRadius:   22,
    justifyContent: "center",
    alignItems:     "center",
  },
  iconWrapJoin: {
    backgroundColor: colors.warningLight,
  },
  iconWrapApproved: {
    backgroundColor: colors.successLight,
  },
  iconWrapDm: {
    backgroundColor: colors.infoLight,
  },
  iconText: {
    fontSize: 20,
  },
  cardBody: {
    flex: 1,
    gap:  2,
  },
  cardTitle: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.sm,
    color:      colors.text,
  },
  cardMessage: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.textSecondary,
    lineHeight: fontSizes.sm * 1.4,
  },
  cardTime: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      colors.textMuted,
    marginTop:  4,
  },
  unreadDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.primary,
    marginTop:       6,
  },
  empty: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
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
  emptyText: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.textSecondary,
  },
});
