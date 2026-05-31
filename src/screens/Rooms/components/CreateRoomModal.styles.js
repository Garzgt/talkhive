import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { fonts, fontSizes } from "../../../styles/fonts";
import { spacing, radius } from "../../../styles/spacing";

export const styles = StyleSheet.create({
  flex: {
    flex:           1,
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    top:      0,
    left:     0,
    right:    0,
    bottom:   0,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor:      colors.background,
    borderTopLeftRadius:  radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal:    spacing.xl,
    paddingBottom:        spacing["3xl"],
    paddingTop:           spacing.md,
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    radius.full,
    backgroundColor: colors.border,
    alignSelf:       "center",
    marginBottom:    spacing.lg,
  },
  header: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   spacing.lg,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.md,
    color:      colors.text,
  },
  input: {
    borderWidth:       1.5,
    borderColor:       colors.border,
    borderRadius:      radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm + 2,
    fontFamily:        fonts.regular,
    fontSize:          fontSizes.base,
    color:             colors.text,
    marginBottom:      spacing.md,
    backgroundColor:   colors.surface,
  },
  inputMulti: {
    height:     90,
    paddingTop: spacing.sm + 2,
  },
  errText: {
    fontFamily:   fonts.regular,
    fontSize:     fontSizes.sm,
    color:        colors.error,
    marginBottom: spacing.sm,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius:    radius.md,
    paddingVertical: spacing.md,
    alignItems:      "center",
    marginTop:       spacing.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.textInverse,
  },
});
