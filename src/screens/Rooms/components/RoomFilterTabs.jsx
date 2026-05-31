import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./RoomFilterTabs.styles";

const TABS = [
  { label: "All",    value: "all" },
  { label: "Joined", value: "joined" },
];

export default function RoomFilterTabs({ active, onChange }) {
  return (
    <View style={styles.row}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          style={[styles.tab, active === tab.value && styles.tabActive]}
          onPress={() => onChange(tab.value)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, active === tab.value && styles.labelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
