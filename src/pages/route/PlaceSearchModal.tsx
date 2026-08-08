import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type CourseType, type PlaceSearchItem, searchPlaces } from '@/api/client';
import LeftBackIcon from '@/assets/icon/basic/left_back.svg';
import SearchIcon from '@/assets/icon/basic/search_glope.svg';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useTheme } from '@/hooks/use-theme';
import type { RoutePlace } from '@/stores/routeStore';
import { THEME_TO_COURSE_TYPE } from './constants';
import { styles } from './createRouteStyles';

type SearchCategory = '일반' | '배리어프리' | '반려동물';

const SEARCH_CATEGORIES: SearchCategory[] = ['일반', '배리어프리', '반려동물'];

interface PlaceSearchModalProps {
  courseType: CourseType;
  onSelectPlace: (place: RoutePlace) => void;
  onClose: () => void;
}

/** API 응답 → RoutePlace 변환 */
function toRoutePlace(item: PlaceSearchItem): RoutePlace {
  return {
    id: item.contentid,
    name: item.title,
    category: item.contenttypeid,
    address: item.addr1 + (item.addr2 ? ` ${item.addr2}` : ''),
    image: item.firstimage || item.firstimage2 || undefined,
  };
}

export function PlaceSearchModal({ courseType, onSelectPlace, onClose }: PlaceSearchModalProps) {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<RoutePlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Category dropdown state
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>(() => {
    const entry = Object.entries(THEME_TO_COURSE_TYPE).find(([, v]) => v === courseType);
    return (entry?.[0] as SearchCategory) || '일반';
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const activeCourseType = THEME_TO_COURSE_TYPE[selectedCategory] || 'GENERAL';

  // 디바운스 검색
  const performSearch = useCallback(
    async (keyword: string, catType: CourseType) => {
      if (!keyword.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      try {
        console.log(`[PlaceSearch] Calling searchPlaces with keyword="${keyword.trim()}", catType="${catType}"`);
        const response = await searchPlaces(keyword.trim(), catType);
        console.log('[PlaceSearch] Response:', response);
        if (response.isSuccess && response.data) {
          setResults(response.data.map(toRoutePlace));
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('[PlaceSearch] Error performing search:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    },
    [],
  );

  const handleChangeText = (text: string) => {
    setSearchQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(text, activeCourseType);
    }, 500);
  };

  // Re-search when category changes
  const handleCategoryChange = (cat: SearchCategory) => {
    setSelectedCategory(cat);
    setShowCategoryDropdown(false);

    const newCourseType = THEME_TO_COURSE_TYPE[cat] || 'GENERAL';
    if (searchQuery.trim()) {
      performSearch(searchQuery, newCourseType);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <ThemedView
      style={[
        styles.modalContainer,
        { paddingTop: safeAreaInsets.top },
      ]}
    >
      {/* Header: Back + Search + Category */}
      <View style={styles.modalHeader}>
        <Pressable onPress={onClose} style={styles.modalBackBtn}>
          <LeftBackIcon width={11} height={17} />
        </Pressable>

        <View style={styles.modalSearchInputContainer}>
          <SearchIcon width={18} height={18} style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={handleChangeText}
            placeholder="장소를 검색하세요.."
            placeholderTextColor="#C0C0C0"
            style={styles.modalSearchInputNew}
            autoFocus
          />
        </View>

        {/* Category Dropdown Button */}
        <View style={{ position: 'relative', zIndex: 20 }}>
          <Pressable
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            style={styles.categoryDropdownBtn}
          >
            <ThemedText style={styles.categoryDropdownBtnText}>{selectedCategory}</ThemedText>
            <ThemedText style={styles.categoryDropdownChevron}>{'▾'}</ThemedText>
          </Pressable>

          {showCategoryDropdown && (
            <View style={styles.categoryDropdownMenu}>
              {SEARCH_CATEGORIES.map((cat) => {
                const isActive = cat === selectedCategory;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => handleCategoryChange(cat)}
                    style={[
                      styles.categoryDropdownItem,
                      isActive && styles.categoryDropdownItemActive,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.categoryDropdownItemText,
                        isActive && styles.categoryDropdownItemTextActive,
                      ]}
                    >
                      {cat}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* Close dropdown overlay */}
      {showCategoryDropdown && (
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }}
          onPress={() => setShowCategoryDropdown(false)}
        />
      )}

      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.suggestionListNew}>
        {/* 로딩 */}
        {isSearching && (
          <View style={styles.emptySearchContainer}>
            <ActivityIndicator size="large" color="#E06635" />
          </View>
        )}

        {/* 검색 결과 — 심플 리스트 (이름 + 주소) */}
        {!isSearching &&
          results.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onSelectPlace(item)}
              style={styles.searchResultItem}
            >
              <ThemedText style={styles.searchResultName}>{item.name}</ThemedText>
              <ThemedText style={styles.searchResultAddr}>{item.address}</ThemedText>
            </Pressable>
          ))}

        {/* 검색 전 안내 */}
        {!isSearching && !hasSearched && results.length === 0 && (
          <View style={styles.emptySearchContainer}>
            <ThemedText themeColor="textSecondary" style={styles.emptySearchText}>
              장소 이름을 입력해서 검색해주세요.
            </ThemedText>
          </View>
        )}

        {/* 결과 없음 */}
        {!isSearching && hasSearched && results.length === 0 && (
          <View style={styles.emptySearchContainer}>
            <ThemedText themeColor="textSecondary" style={styles.emptySearchText}>
              검색 결과가 없습니다.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
