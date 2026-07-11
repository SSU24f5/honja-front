import { SymbolView } from 'expo-symbols';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { FavoriteList } from '@/components/map/FavoriteList';
import { FilterPanel } from '@/components/map/FilterPanel';
import { useTheme } from '@/hooks/use-theme';
import { useMapStore } from '@/stores/mapStore';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';

export default function MapScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { places, filters } = useMapStore();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  // Filter places based on active tags
  const filteredPlaces = places.filter((p) => {
    if (filters.barrierFree && !p.barrierFree) return false;
    if (filters.petFriendly && !p.petFriendly) return false;
    if (filters.parking && !p.parking) return false;
    return true;
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            제주 여행 지도
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            조건에 맞는 맞춤형 여행지를 찾아보세요
          </ThemedText>
        </ThemedView>

        {/* Filter tags panel */}
        <FilterPanel />

        {/* Mock Map View */}
        <ThemedView style={styles.mapMock} type="backgroundElement">
          <ThemedView style={styles.mapBg}>
            {/* Draw a mock stylized grid to look like a map */}
            <ThemedView style={styles.gridLineH} />
            <ThemedView style={styles.gridLineV} />

            {/* Render markers of filtered places */}
            {filteredPlaces.map((place, idx) => (
              <View
                key={place.id}
                style={[
                  styles.marker,
                  {
                    top: 40 + idx * 45,
                    left: 50 + idx * 60,
                  },
                ]}
              >
                <SymbolView
                  name="mappin.circle.fill"
                  tintColor={place.favorite ? '#FF2D55' : '#007AFF'}
                  size={24}
                />
                <View style={styles.markerLabel}>
                  <ThemedText style={styles.markerText}>{place.name}</ThemedText>
                </View>
              </View>
            ))}
          </ThemedView>
          <ThemedView style={styles.mapFooter}>
            <ThemedText type="small" themeColor="textSecondary">
              표시 중인 장소: {filteredPlaces.length}개
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Favorites list */}
        <FavoriteList />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flex: 1,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
    gap: Spacing.one,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  mapMock: {
    height: 300,
    marginHorizontal: Spacing.four,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#E4F2FD',
    position: 'relative',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: '#C7C7CC',
  },
  markerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  mapFooter: {
    height: 36,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
});
