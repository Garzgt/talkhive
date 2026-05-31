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
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
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
  headerActions: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing.xs,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  searchBar: {
    flexDirection:     "row",
    alignItems:        "center",
    marginHorizontal:  spacing.base,
    marginTop:         spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    backgroundColor:   colors.surface,
    borderRadius:      radius.lg,
    borderWidth:       1.5,
    borderColor:       colors.border,
    gap:               spacing.sm,
  },
  searchInput: {
    flex:       1,
    fontFamily: fonts.regular,
    fontSize:   fontSizes.base,
    color:      colors.text,
    paddingVertical: 0,
  },
  loaderWrap: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  empty: {
    alignItems:        "center",
    paddingTop:        spacing["5xl"],
    paddingHorizontal: spacing["2xl"],
    gap:               spacing.md,
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
  },
});
