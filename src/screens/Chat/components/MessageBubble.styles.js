import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { fonts, fontSizes } from "../../../styles/fonts";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    marginHorizontal: spacing.md,
    marginVertical:   3,
    justifyContent: "flex-start",
  },
  rowOwn: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth:          "75%",
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    borderRadius:      radius.lg,
    backgroundColor:   colors.messageReceived,
    borderBottomLeftRadius: 4,
  },
  bubbleOwn: {
    backgroundColor:    colors.messageSent,
    borderBottomLeftRadius:  radius.lg,
    borderBottomRightRadius: 4,
  },
  senderName: {
    fontFamily:   fonts.semiBold,
    fontSize:     fontSizes.xs,
    color:        colors.primary,
    marginBottom: 2,
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
});
