import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../config/routes";
import { styles } from "./Search.styles";
import UserSearchResult from "./components/UserSearchResult";
import { searchUsers } from "./services/searchService";

export default function Search({ navigation }) {
  const { profile }           = useAuth();
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef           = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        console.log("[Search] querying:", query);
        const data = await searchUsers(query, profile.id);
        console.log("[Search] got", data.length, "results");
        setResults(data);
        setSearched(true);
      } catch (e) {
        console.log("[Search] error →", e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleSelectUser(user) {
    const userName = user.display_name || user.username;
    console.log("[Search] navigating to DM with:", userName);
    navigation.navigate(ROUTES.DM_INBOX, {
      screen: ROUTES.DM_CONVERSATION,
      initial: false,
      params: { userId: user.id, userName, userAvatar: user.avatar_url },
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.input}
          placeholder="Search by username or name..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.centerWrap}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="person-outline" size={36} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyText}>No users found for "{query}"</Text>
        </View>
      ) : !searched ? (
        <View style={styles.centerWrap}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="search-outline" size={36} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyText}>Search for people to message</Text>
        </View>
      ) : (
        <FlashList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserSearchResult user={item} onPress={() => handleSelectUser(item)} />
          )}
          estimatedItemSize={74}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}
