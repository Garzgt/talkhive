import { View, Text, StyleSheet } from "react-native";
export default function PlaceholderScreen({ route }) {
  return (
    <View style={s.c}>
      <Text style={s.t}>{route?.name ?? "Screen"}</Text>
    </View>
  );
}
const s = StyleSheet.create({ c: { flex:1, justifyContent:"center", alignItems:"center" }, t: { fontSize:18, color:"#6B7280" } });
