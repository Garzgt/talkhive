import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { fonts, fontSizes } from "../../styles/fonts";
import { spacing, radius } from "../../styles/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: spacing.base,
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.md,
    backgroundColor:   colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap:               spacing.sm,
  },
  headerCenter: {
    flex:          1,
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing.sm,
  },
  headerAvatarWrap: {
    position: "relative",
  },
  headerOnlineDot: {
    position:        "absolute",
    bottom:          0,
    right:           0,
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: colors.online,
    borderWidth:     2,
    borderColor:     colors.background,
  },
  headerNameWrap: {
    flex: 1,
  },
  headerStatus: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      colors.online,
  },
  headerStatusOffline: {
    color: colors.textMuted,
  },
  headerAvatar: {
    width:           34,
    height:          34,
    borderRadius:    radius.full,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
  },
  headerAvatarImage: {
    width:        34,
    height:       34,
    borderRadius: radius.full,
  },
  headerInitial: {
    fontFamily: fonts.bold,
    fontSize:   fontSizes.base,
    color:      "#fff",
  },
  headerName: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.text,
    flex:       1,
  },
  headerSpacer: {
    width: 34,
  },
  loaderWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
  },
  emptyWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
    gap:            spacing.md,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.textMuted,
  },
  listContent: {
    flexGrow:        1,
    paddingVertical: spacing.sm,
  },
  bubbleRow: {
    flexDirection:    "row",
    marginHorizontal: spacing.md,
    marginVertical:   3,
    justifyContent:   "flex-start",
  },
  bubbleRowOwn: {
    justifyContent: "flex-end",
  },
  bubbleCol: {
    maxWidth: "75%",
  },
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
  editingBar: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: spacing.base,
    paddingVertical:   spacing.xs,
    backgroundColor:   colors.primaryLight,
    gap:               spacing.sm,
  },
  editingBarText: {
    flex:       1,
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.primaryDark,
  },
  actionOverlay: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent:  "flex-end",
  },
  actionSheet: {
    backgroundColor:      colors.background,
    borderTopLeftRadius:  radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal:    spacing.base,
    paddingBottom:        spacing["3xl"],
    paddingTop:           spacing.md,
  },
  reactionRow: {
    flexDirection:     "row",
    justifyContent:    "space-around",
    paddingVertical:   spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom:      spacing.xs,
  },
  reactionBtn: {
    padding: spacing.sm,
  },
  reactionBtnEmoji: {
    fontSize: 28,
  },
  actionItem: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             spacing.md,
    paddingVertical: spacing.md,
  },
  actionItemText: {
    fontFamily: fonts.medium,
    fontSize:   fontSizes.base,
    color:      colors.text,
  },
  actionItemDanger: {
    color: colors.error,
  },
  image: {
    width:        220,
    height:       180,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  bubbleText: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.base,
    color:      colors.text,
    lineHeight: fontSizes.base * 1.45,
  },
  bubbleTextOwn: {
    color: colors.textInverse,
  },
  bubbleTime: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      colors.textMuted,
    alignSelf:  "flex-end",
    marginTop:  3,
  },
  bubbleTimeOwn: {
    color: "rgba(255,255,255,0.65)",
  },
  typingRow: {
    paddingHorizontal: spacing.base,
    paddingVertical:   4,
  },
  typingText: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.xs,
    color:      colors.textMuted,
    fontStyle:  "italic",
  },
  inputWrapper: {
    borderTopWidth:  1,
    borderTopColor:  colors.border,
    backgroundColor: colors.background,
  },
  imagePreview: {
    paddingHorizontal: spacing.md,
    paddingTop:        spacing.sm,
  },
  previewThumb: {
    width:        80,
    height:       80,
    borderRadius: radius.md,
  },
  removeImage: {
    position: "absolute",
    top:      spacing.sm - 4,
    left:     spacing.md + 60,
  },
  inputBar: {
    flexDirection:     "row",
    alignItems:        "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    paddingBottom:     spacing.md,
    gap:               spacing.sm,
  },
  imageBtn: {
    paddingBottom: spacing.xs,
  },
  input: {
    flex:              1,
    minHeight:         40,
    maxHeight:         100,
    borderWidth:       1.5,
    borderColor:       colors.border,
    borderRadius:      radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    fontFamily:        fonts.regular,
    fontSize:          fontSizes.base,
    color:             colors.text,
    backgroundColor:   colors.surface,
  },
  sendBtn: {
    width:           40,
    height:          40,
    borderRadius:    radius.full,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
  viewerBg: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent:  "center",
    alignItems:      "center",
  },
  viewerImage: {
    width:  "100%",
    height: "85%",
  },
  viewerClose: {
    position: "absolute",
    top:      48,
    right:    20,
  },
});
