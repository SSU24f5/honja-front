import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { FavoriteList } from '@/components/map/FavoriteList';
import { FilterPanel } from '@/components/map/FilterPanel';
import { useTheme } from '@/hooks/use-theme';
import { useMapStore } from '@/stores/mapStore';
import { useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';

export default function MapScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { places, filters, toggleFavorite } = useMapStore();
  const { addPlaceToRoute } = useRouteStore();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>('place-1');

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

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  const handleAddPlace = (place: { id: string; name: string }) => {
    addPlaceToRoute({
      id: place.id,
      name: place.name,
      address: '제주 제주시 도두일동 산 1',
      category: '자연명소',
    });
    if (Platform.OS === 'web') {
      window.alert(`${place.name}이(가) 일정에 추가되었습니다.`);
    } else {
      Alert.alert('알림', `${place.name}이(가) 일정에 추가되었습니다.`);
    }
  };

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

        {/* Search bar */}
        <ThemedView style={styles.searchBarContainer} type="backgroundElement">
          <SymbolView name="magnifyingglass" tintColor="#8E8E93" size={18} />
          <TextInput
            placeholder="원하는 장소를 입력해 주세요"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
            editable={false} // Read-only mock search input
          />
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
            {filteredPlaces.map((place, idx) => {
              const isSelected = place.id === selectedPlaceId;
              return (
                <Pressable
                  key={place.id}
                  onPress={() => setSelectedPlaceId(place.id)}
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
                    tintColor={isSelected ? '#D36D3A' : place.favorite ? '#FF2D55' : '#8E8E93'}
                    size={isSelected ? 28 : 24}
                  />
                  <View style={styles.markerLabel}>
                    <ThemedText style={styles.markerText}>{place.name}</ThemedText>
                  </View>
                </Pressable>
              );
            })}
          </ThemedView>
          <ThemedView style={styles.mapFooter}>
            <ThemedText type="small" themeColor="textSecondary">
              표시 중인 장소: {filteredPlaces.length}개 (마커 클릭 시 상세 카드 표시)
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Selected place drawer/card */}
        {selectedPlace && (
          <ThemedView style={styles.detailCard} type="backgroundElement">
            <ThemedView style={styles.detailHeader}>
              <ThemedText type="smallBold" style={styles.detailTitle}>
                {selectedPlace.name}
              </ThemedText>
              <Pressable
                onPress={() => toggleFavorite(selectedPlace.id)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <SymbolView
                  name={selectedPlace.favorite ? 'heart.fill' : 'heart'}
                  tintColor="#FF2D55"
                  size={22}
                />
              </Pressable>
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary" style={styles.detailAddress}>
              제주 제주시 도두일동 산 1 (도두동 무지개해안도로 인근)
            </ThemedText>
            <ThemedView style={styles.detailInfoRow}>
              <ThemedView style={styles.detailTag}>
                <ThemedText type="code" style={styles.detailTagText}>
                  {selectedPlace.barrierFree ? '♿ 배리어프리' : '🚫 휠체어 제한'}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.detailTag}>
                <ThemedText type="code" style={styles.detailTagText}>
                  {selectedPlace.petFriendly ? '🐾 반려동물 동반' : '🚫 반려동물 불가'}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.detailActions}>
              <Pressable
                onPress={() => handleAddPlace(selectedPlace)}
                style={({ pressed }) => [styles.detailBtnPrimary, pressed && styles.pressed]}
              >
                <ThemedText style={styles.detailBtnTextPrimary}>일정에 추가</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setSelectedPlaceId(null)}
                style={({ pressed }) => [styles.detailBtnSecondary, pressed && styles.pressed]}
              >
                <ThemedText style={styles.detailBtnTextSecondary}>닫기</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        )}

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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    marginHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  detailCard: {
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    gap: Spacing.two,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  detailTitle: {
    fontSize: 18,
    fontFamily: 'EF_jejudoldam',
    color: '#000000',
  },
  detailAddress: {
    fontSize: 13,
  },
  detailInfoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  detailTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailTagText: {
    fontSize: 11,
  },
  detailActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
    marginTop: Spacing.one,
  },
  detailBtnPrimary: {
    flex: 2,
    backgroundColor: '#D36D3A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnTextPrimary: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailBtnSecondary: {
    flex: 1,
    backgroundColor: '#E5E5EA',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnTextSecondary: {
    color: '#000000',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
});
