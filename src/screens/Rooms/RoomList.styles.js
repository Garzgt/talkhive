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
    justifyContent:    "space-between",
    alignItems:        "center",
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
  headerActions: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing.xs,
  },
  iconBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems:     "center",
  },
  addBtn: {
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: colors.primary,
    justifyContent:  "center",
    alignItems:      "center",
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
  searchInput: {
    flex:            1,
    fontFamily:      fonts.regular,
    fontSize:        fontSizes.sm,
    color:           colors.text,
    paddingVertical: 0,
  },
  loaderWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
  },
  listContent: {
    paddingTop:    spacing.sm,
    paddingBottom: spacing["2xl"],
  },
  empty: {
    alignItems:        "center",
    paddingTop:        spacing["5xl"],
    paddingHorizontal: spacing["2xl"],
    gap:               spacing.md,
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
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize:   fontSizes.base,
    color:      colors.textSecondary,
  },
  emptyDesc: {
    fontFamily: fonts.regular,
    fontSize:   fontSizes.sm,
    color:      colors.textMuted,
    textAlign:  "center",
    lineHeight: fontSizes.sm * 1.6,
  },
});
