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
  roomName: {
    flex:       1,
    fontFamily: fonts.bold,
    fontSize:   fontSizes.lg,
    color:      colors.text,
    textAlign:  "center",
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
});
