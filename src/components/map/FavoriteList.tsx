import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useMapStore } from '@/stores/mapStore';
import { Spacing } from '@/styles/theme';

export function FavoriteList() {
  const { places, toggleFavorite } = useMapStore();
  const favoritePlaces = places.filter((p) => p.favorite);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <SymbolView name="heart.fill" tintColor="#FF2D55" size={20} />
        <ThemedText type="smallBold" style={styles.title}>
          즐겨찾기 장소 ({favoritePlaces.length})
        </ThemedText>
      </ThemedView>

      {favoritePlaces.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="small" themeColor="textSecondary">
            즐겨찾는 장소가 없습니다.
          </ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.list}>
          {favoritePlaces.map((place) => (
            <ThemedView key={place.id} style={styles.card}>
              <ThemedView style={styles.cardText}>
                <ThemedText type="smallBold">{place.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {place.description}
                </ThemedText>
                <ThemedView style={styles.tags}>
                  {place.barrierFree && (
                    <ThemedView style={styles.tag} type="backgroundSelected">
                      <ThemedText style={styles.tagText}>배리어프리</ThemedText>
                    </ThemedView>
                  )}
                  {place.petFriendly && (
                    <ThemedView style={styles.tag} type="backgroundSelected">
                      <ThemedText style={styles.tagText}>반려동물</ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
              </ThemedView>

              <Pressable
                onPress={() => toggleFavorite(place.id)}
                style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}
              >
                <SymbolView name="heart.fill" tintColor="#FF2D55" size={20} />
              </Pressable>
            </ThemedView>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.four,
  },
  title: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginHorizontal: Spacing.four,
  },
  list: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: Spacing.three,
  },
  cardText: {
    flex: 1,
    gap: 4,
    backgroundColor: 'transparent',
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    padding: Spacing.one,
  },
  pressed: {
    opacity: 0.6,
  },
});
