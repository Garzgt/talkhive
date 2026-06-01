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
  searchBar: {
    flexDirection:     "row",
    alignItems:        "center",
    marginHorizontal:  spacing.base,
    marginTop:         spacing.sm,
    marginBottom:      spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    backgroundColor:   colors.background,
    borderRadius:      radius.xl,
    borderWidth:       1.5,
    borderColor:       colors.border,
    gap:               spacing.sm,
  },
  input: {
    flex:            1,
    fontFamily:      fonts.regular,
    fontSize:        fontSizes.sm,
    color:           colors.text,
    paddingVertical: 0,
  },
  listContent: {
    paddingTop:    spacing.sm,
    paddingBottom: spacing["2xl"],
  },
  centerWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
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
    fontFamily:        fonts.regular,
    fontSize:          fontSizes.sm,
    color:             colors.textMuted,
    textAlign:         "center",
    paddingHorizontal: spacing["2xl"],
  },
});
