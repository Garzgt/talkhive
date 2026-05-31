import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { fonts, fontSizes } from "../../styles/fonts";
import { spacing, radius } from "../../styles/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingVertical:   spacing.sm,
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
    margin:            spacing.base,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    backgroundColor:   colors.surface,
    borderRadius:      radius.lg,
    borderWidth:       1.5,
    borderColor:       colors.border,
    gap:               spacing.sm,
  },
  input: {
    flex:       1,
    fontFamily: fonts.regular,
    fontSize:   fontSizes.base,
    color:      colors.text,
    paddingVertical: 0,
  },
  centerWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
    gap:            spacing.md,
    paddingBottom:  spacing["5xl"],
  },
  emptyText: {
    fontFamily:        fonts.regular,
    fontSize:          fontSizes.sm,
    color:             colors.textMuted,
    textAlign:         "center",
    paddingHorizontal: spacing["2xl"],
  },
});
