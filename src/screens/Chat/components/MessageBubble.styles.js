import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { fonts, fontSizes } from "../../../styles/fonts";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  row: {
    flexDirection:    "row",
    alignItems:       "flex-end",
    marginHorizontal: spacing.md,
    marginVertical:   3,
    gap:              spacing.xs,
  },
  rowOwn: {
    justifyContent: "flex-end",
  },
  avatarWrap: {
    marginBottom: 2,
  },
  avatarImage: {
    width:        28,
    height:       28,
    borderRadius: radius.full,
  },
  avatarPlaceholder: {
    width:           28,
    height:          28,
    borderRadius:    radius.full,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
  },
  avatarInitial: {
    fontFamily: fonts.bold,
    fontSize:   11,
    color:      "#fff",
  },
  bubbleCol: {
    maxWidth: "75%",
  },
  bubbleWrapper: {},
  bubble: {
    paddingHorizontal:      spacing.md,
    paddingVertical:        spacing.sm,
    borderRadius:           radius.lg,
    backgroundColor:        colors.messageReceived,
    borderBottomLeftRadius: 4,
  },
  bubbleOwn: {
    backgroundColor:         colors.messageSent,
    borderBottomLeftRadius:  radius.lg,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {},
  senderName: {
    fontFamily:   fonts.semiBold,
    fontSize:     fontSizes.xs,
    color:        colors.primary,
    marginBottom: 2,
  },
  image: {
    width:        220,
    height:       180,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.base,
    color:      colors.text,
    lineHeight: fontSizes.base * 1.45,
  },
  bodyOwn: {
    color: colors.textInverse,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      colors.textMuted,
    alignSelf:  "flex-end",
    marginTop:  3,
  },
  timeOwn: {
    color: "rgba(255,255,255,0.65)",
  },
  editedTag: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      "rgba(0,0,0,0.4)",
    alignSelf:  "flex-end",
  },
  editedTagOwn: {
    color: "rgba(255,255,255,0.5)",
  },
  reactionBar: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           4,
    marginTop:     4,
    paddingLeft:   4,
  },
  reactionBarOwn: {
    justifyContent: "flex-end",
    paddingLeft:    0,
    paddingRight:   4,
  },
  reactionPill: {
    flexDirection:     "row",
    alignItems:        "center",
    backgroundColor:   colors.surface,
    borderWidth:       1,
    borderColor:       colors.border,
    borderRadius:      12,
    paddingHorizontal: 7,
    paddingVertical:   2,
    gap:               3,
  },
  reactionPillMine: {
    backgroundColor: colors.primaryLight,
    borderColor:     colors.primary,
  },
  reactionEmoji: {
    fontSize: 13,
  },
  reactionCount: {
    fontFamily: fonts.medium,
    fontSize:   10,
    color:      colors.textSecondary,
  },
});
