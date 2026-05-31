import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { spacing, radius } from "../../../styles/spacing";

export const getStrengthInfo = (score) => {
  const map = [
    { color: colors.border,   label: "" },
    { color: "#EF4444",       label: "Very weak"   },
    { color: "#F97316",       label: "Weak"        },
    { color: "#EAB308",       label: "Fair"        },
    { color: "#84CC16",       label: "Strong"      },
    { color: "#22C55E",       label: "Very strong" },
  ];
  return map[Math.min(score, 5)];
};

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  barsRow: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 5,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
  },
});
