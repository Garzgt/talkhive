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
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap:               spacing.sm,
  },
  roomName: {
    flex:       1,
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
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
  inputBar: {
    flexDirection:   "row",
    alignItems:      "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    paddingBottom:     spacing.md,
    borderTopWidth:    1,
    borderTopColor:    colors.border,
    gap:               spacing.sm,
    backgroundColor:   colors.background,
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
});
