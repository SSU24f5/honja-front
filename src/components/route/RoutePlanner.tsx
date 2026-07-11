import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useRouteStore } from '@/stores/routeStore';
import { Spacing } from '@/styles/theme';

export function RoutePlanner() {
  const { itinerary, recommendations, addPlaceToRoute, removePlaceFromRoute } = useRouteStore();

  return (
    <ThemedView style={styles.container}>
      {/* Itinerary segments */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <SymbolView name="map.fill" tintColor="#007AFF" size={18} />
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            나의 일정 장소 ({itinerary.length})
          </ThemedText>
        </ThemedView>

        {itinerary.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText type="small" themeColor="textSecondary">
              일정에 추가된 장소가 없습니다.
            </ThemedText>
          </ThemedView>
        ) : (
          <View style={styles.itineraryList}>
            {itinerary.map((place, idx) => (
              <ThemedView key={place.id} style={styles.itineraryItem}>
                <ThemedView style={styles.timelineColumn}>
                  <ThemedView style={styles.bulletContainer}>
                    <ThemedText style={styles.bulletText}>{idx + 1}</ThemedText>
                  </ThemedView>
                  {idx < itinerary.length - 1 && <ThemedView style={styles.timelineLine} />}
                </ThemedView>

                <ThemedView style={styles.placeCard}>
                  <ThemedView style={styles.placeInfo}>
                    <ThemedText type="smallBold">{place.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.placeAddress}>
                      {place.address}
                    </ThemedText>
                  </ThemedView>
                  <Pressable
                    onPress={() => removePlaceFromRoute(place.id)}
                    style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                  >
                    <SymbolView name="trash.fill" tintColor="#FF3B30" size={16} />
                  </Pressable>
                </ThemedView>
              </ThemedView>
            ))}
          </View>
        )}
      </ThemedView>

      {/* Recommendations */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <SymbolView name="sparkles" tintColor="#FFCC00" size={18} />
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            추천 관광지
          </ThemedText>
        </ThemedView>

        <View style={styles.recList}>
          {recommendations.map((place) => (
            <ThemedView key={place.id} style={styles.recCard}>
              <ThemedView style={styles.recText}>
                <ThemedText type="smallBold">{place.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {place.category}
                </ThemedText>
              </ThemedView>
              <Pressable
                onPress={() => addPlaceToRoute(place)}
                style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
              >
                <SymbolView name="plus.circle.fill" tintColor="#34C759" size={20} />
              </Pressable>
            </ThemedView>
          ))}
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
  },
  section: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.four,
  },
  sectionTitle: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: Spacing.five,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginHorizontal: Spacing.four,
  },
  itineraryList: {
    paddingHorizontal: Spacing.four,
  },
  itineraryItem: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  timelineColumn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 24,
  },
  bulletContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#007AFF',
    marginVertical: 4,
  },
  placeCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  placeInfo: {
    flex: 1,
    gap: 2,
    backgroundColor: 'transparent',
  },
  placeAddress: {
    fontSize: 12,
  },
  actionButton: {
    padding: Spacing.one,
  },
  pressed: {
    opacity: 0.6,
  },
  recList: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  recCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: Spacing.three,
  },
  recText: {
    backgroundColor: 'transparent',
    gap: 2,
  },
  addButton: {
    padding: Spacing.one,
  },
});
