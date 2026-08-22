import { useState, useMemo } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, Spacing } from '@/styles/theme';

// Safe WebView import for Mobile platform
let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('react-native-webview is not available', e);
  }
}

type DropdownCategory = '일반' | '배리어프리' | '반려동물';
type SubCategory = '공연' | '쇼핑' | '음식점' | '관광지' | '숙박' | '레포츠';

interface PlaceData {
  id: string;
  name: string;
  category: SubCategory;
  address: string;
  hours: string;
  tel: string;
  imageUrl: string;
  lat: number;
  lng: number;
  // Category specific details
  barrierFree: {
    accessibility: string[]; // e.g. ['이동', '시각', '청각', '영유아']
    convenience: string;
  };
  petFriendly: {
    tags: string[]; // e.g. ['소형견', '반려동물 동반 가능']
    rules: string;
  };
}

const MOCK_PLACES: PlaceData[] = [
  {
    id: 'p1',
    name: '아베베 베이커리',
    category: '음식점',
    address: '제주 제주시 동문로 6길 4 1-3층(일도일동)',
    hours: '영업 중 · 22:00에 영업 종료',
    tel: '02-1233-4445',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    lat: 33.5126,
    lng: 126.5284,
    barrierFree: {
      accessibility: ['이동', '시각', '청각', '영유아'],
      convenience: '엘리베이터 완비, 휠체어 전용 경사로, 보조견 입장 가능',
    },
    petFriendly: {
      tags: ['소형견', '반려동물 동반 가능'],
      rules: '동반 시 필요사항 - 개모차 혹은 이동 가방 필수 이용.',
    },
  },
  {
    id: 'p2',
    name: '우진해장국',
    category: '음식점',
    address: '제주특별자치도 제주시 서사로 11',
    hours: '영업 중 · 24시간 영업',
    tel: '064-727-3393',
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500',
    lat: 33.5115,
    lng: 126.5201,
    barrierFree: {
      accessibility: ['이동', '청각'],
      convenience: '입구 무장애 경사로 설치, 시각 장애 안내견 동반 가능',
    },
    petFriendly: {
      tags: ['중형견 가능', '반려동물 동반 가능'],
      rules: '동반 시 필요사항 - 리드줄 짧게 착용 필수.',
    },
  },
  {
    id: 'p3',
    name: '오설록 티 뮤지엄',
    category: '관광지',
    address: '제주특별자치도 서귀포시 안덕면 신화역사로 15',
    hours: '영업 중 · 18:00에 영업 종료',
    tel: '064-794-5312',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500',
    lat: 33.3060,
    lng: 126.3283,
    barrierFree: {
      accessibility: ['이동', '시각', '영유아'],
      convenience: '전 구역 무장애 목재 데크 길 완비, 유모차 대여 서비스 제공',
    },
    petFriendly: {
      tags: ['소형견', '야외만 허용'],
      rules: '야외 잔디밭 입장은 가능하나 실내 전시관 출입은 불가합니다.',
    },
  },
];

export default function MapScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { addPlaceToRoute } = useRouteStore();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DropdownCategory>('일반');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>('음식점');

  // Selected place state
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(MOCK_PLACES[0]);

  // Sub-categories list
  const subCategories: SubCategory[] = ['공연', '쇼핑', '음식점', '관광지', '숙박', '레포츠'];

  // Kakao Map URL Builder
  const mapUrl = useMemo(() => {
    if (selectedPlace) {
      // Encode coordinate and name to direct to Kakao Map Link
      return `https://map.kakao.com/link/search/${encodeURIComponent('제주 ' + selectedPlace.name)}`;
    }
    return `https://map.kakao.com/link/search/${encodeURIComponent('제주 맛집')}`;
  }, [selectedPlace]);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return MOCK_PLACES.filter(
      (place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddPlace = () => {
    if (!selectedPlace) return;
    addPlaceToRoute({
      id: selectedPlace.id,
      name: selectedPlace.name,
      address: selectedPlace.address,
      category: selectedPlace.category,
    });

    const successMsg = `"${selectedPlace.name}"이(가) 일정에 추가되었습니다.`;
    if (Platform.OS === 'web') window.alert(successMsg);
    else Alert.alert('성공', successMsg);
  };

  const handleSearchResultClick = (place: PlaceData) => {
    setSelectedPlace(place);
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleCloseSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* 1. Top Section: Search Bar & Sub-category Slider */}
      <View style={[styles.topPanel, { paddingTop: Math.max(safeAreaInsets.top, Spacing.three) }]}>
        <View style={styles.searchBarRow}>
          {isSearching && (
            <Pressable onPress={handleCloseSearch} style={styles.backArrowBtn} hitSlop={10}>
              <Text style={styles.backArrowText}>‹</Text>
            </Pressable>
          )}

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearching(true)}
              placeholder="원하는 장소를 검색하세요."
              placeholderTextColor="#C0C0C0"
              style={styles.searchInput}
            />
          </View>

          {/* Category Dropdown Trigger */}
          <View style={{ position: 'relative', zIndex: 50 }}>
            <Pressable
              onPress={() => setDropdownVisible(!dropdownVisible)}
              style={styles.dropdownBtn}
            >
              <Text style={styles.dropdownBtnText}>{selectedCategory}</Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </Pressable>

            {dropdownVisible && (
              <View style={styles.dropdownMenu}>
                {(['일반', '배리어프리', '반려동물'] as DropdownCategory[]).map((cat) => {
                  const isActive = cat === selectedCategory;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setDropdownVisible(false);
                      }}
                      style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    >
                      <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Sub-category list */}
        {!isSearching && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subCategorySlider}
          >
            {subCategories.map((sub) => {
              const isSelected = sub === selectedSubCategory;
              return (
                <Pressable
                  key={sub}
                  onPress={() => setSelectedSubCategory(sub)}
                  style={[styles.subCategoryBtn, isSelected && styles.subCategoryBtnSelected]}
                >
                  <Text style={[styles.subCategoryText, isSelected && styles.subCategoryTextSelected]}>
                    {sub}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Dropdown background dim overlay */}
      {dropdownVisible && (
        <Pressable style={styles.dropdownOverlay} onPress={() => setDropdownVisible(false)} />
      )}

      {/* 2. Main Area: Kakao Map or Search Results */}
      <View style={styles.mapArea}>
        {isSearching && searchQuery.trim().length > 0 ? (
          /* Search results overlay list */
          <ScrollView style={styles.searchResultsContainer}>
            {searchResults.length > 0 ? (
              searchResults.map((place) => (
                <Pressable
                  key={place.id}
                  onPress={() => handleSearchResultClick(place)}
                  style={styles.searchResultItem}
                >
                  <Text style={styles.searchResultName}>{place.name}</Text>
                  <Text style={styles.searchResultAddress}>{place.address}</Text>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyResults}>
                <Text style={styles.emptyResultsText}>검색 결과가 없습니다.</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          /* Live Kakao Map frame integration */
          <View style={styles.mapFrameWrapper}>
            {Platform.OS === 'web' ? (
              <iframe
                src={mapUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Kakao Map"
              />
            ) : WebView ? (
              <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
            ) : (
              <View style={styles.mapFallback}>
                <Text style={styles.mapFallbackText}>지도를 불러올 수 없습니다 (WebView 미지원)</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* 3. Bottom Detail Sheet (only visible if place is selected and not searching) */}
      {!isSearching && selectedPlace && (
        <View style={[styles.detailBottomCabinet, { paddingBottom: safeAreaInsets.bottom + BottomTabInset }]}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailName}>{selectedPlace.name}</Text>
            <Pressable onPress={handleAddPlace} style={styles.addBtn}>
              <Text style={styles.addBtnText}>추가하기</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.detailAddress}>{selectedPlace.address}</Text>
            <Text style={styles.detailHours}>{selectedPlace.hours}</Text>
            <Text style={styles.detailTel}>{selectedPlace.tel}</Text>

            <Image source={{ uri: selectedPlace.imageUrl }} style={styles.placeImage} />

            {/* 3.1. 배리어프리 전용 렌더링 */}
            {selectedCategory === '배리어프리' && (
              <View style={styles.barrierFreeSection}>
                <View style={styles.accBadgeRow}>
                  {['이동', '시각', '청각', '영유아'].map((feature) => {
                    const hasFeature = selectedPlace.barrierFree.accessibility.includes(feature);
                    return (
                      <View
                        key={feature}
                        style={[styles.accCircleBadge, hasFeature && styles.accCircleBadgeActive]}
                      >
                        <Text style={[styles.accCircleText, hasFeature && styles.accCircleTextActive]}>
                          {feature}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.divider} />
                <View style={styles.detailsBlock}>
                  <Text style={styles.sectionTitle}>이용 편의</Text>
                  <Text style={styles.sectionContent}>
                    {selectedPlace.barrierFree.convenience}
                  </Text>
                </View>
              </View>
            )}

            {/* 3.2. 반려동물 전용 렌더링 */}
            {selectedCategory === '반려동물' && (
              <View style={styles.petSection}>
                <View style={styles.petBadgeRow}>
                  {selectedPlace.petFriendly.tags.map((tag) => (
                    <View key={tag} style={styles.petTagBadge}>
                      <Text style={styles.petTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.divider} />
                <View style={styles.detailsBlock}>
                  <Text style={styles.sectionTitle}>동반 시 필요사항 및 사고 위협 사항</Text>
                  <Text style={styles.sectionContent}>
                    {selectedPlace.petFriendly.rules}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topPanel: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    zIndex: 10,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backArrowBtn: {
    marginRight: 4,
  },
  backArrowText: {
    fontSize: 32,
    color: '#8E8E93',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F6',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EB',
    borderWidth: 1,
    borderColor: '#E06635',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    height: 44,
    gap: 4,
  },
  dropdownBtnText: {
    color: '#E06635',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dropdownChevron: {
    color: '#E06635',
    fontSize: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    width: 110,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.two,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#FFF2EB',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#1C1C1E',
  },
  dropdownItemTextActive: {
    color: '#E06635',
    fontWeight: 'bold',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  subCategorySlider: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.three,
    paddingHorizontal: 2,
  },
  subCategoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FAF8F6',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  subCategoryBtnSelected: {
    backgroundColor: '#E06635',
    borderColor: '#E06635',
  },
  subCategoryText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  subCategoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E4F2FD',
  },
  mapFrameWrapper: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapFallbackText: {
    color: '#8E8E93',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 15,
  },
  searchResultItem: {
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderColor: '#F2F2F7',
    gap: 4,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  searchResultAddress: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyResults: {
    padding: Spacing.five,
    alignItems: 'center',
  },
  emptyResultsText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  // Bottom cabinet detail cards
  detailBottomCabinet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    maxHeight: 380,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  addBtn: {
    backgroundColor: '#E06635',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  detailScroll: {
    flexGrow: 1,
    marginBottom: Spacing.two,
  },
  detailAddress: {
    fontSize: 13,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  detailHours: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  detailTel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: Spacing.three,
  },
  placeImage: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    resizeMode: 'cover',
    marginBottom: Spacing.three,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: Spacing.three,
  },
  detailsBlock: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  sectionContent: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },
  // Barrier-free layout details
  barrierFreeSection: {
    marginTop: Spacing.one,
  },
  accBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginVertical: Spacing.one,
  },
  accCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F6',
  },
  accCircleBadgeActive: {
    borderColor: '#E06635',
    backgroundColor: '#FFF2EB',
  },
  accCircleText: {
    fontSize: 11,
    color: '#8E8E93',
  },
  accCircleTextActive: {
    color: '#E06635',
    fontWeight: 'bold',
  },
  // Pet-friendly layout details
  petSection: {
    marginTop: Spacing.one,
  },
  petBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: Spacing.one,
  },
  petTagBadge: {
    backgroundColor: '#FFF2EB',
    borderWidth: 1,
    borderColor: '#E06635',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  petTagText: {
    color: '#E06635',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
