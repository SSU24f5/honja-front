import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, Pressable, View } from 'react-native';
import CheckedRadioIcon from '@/assets/icon/basic/checked_radio.svg';
import EmptyRadioIcon from '@/assets/icon/basic/empty_radio.svg';
import RefreshIcon from '@/assets/icon/basic/refresh.svg';
import { getBetweenRecommendation, type RecommendedPlaceDto } from '@/api/recommendation';
import { ThemedText } from '@/components/common/themed-text';
import { styles } from './createRouteStyles';

export interface PlaceOptionItem {
  id: string;
  name: string;
  tag?: string;
}

interface PlaceRecommendationModalProps {
  visible: boolean;
  courseType?: string;
  availablePlaces?: PlaceOptionItem[];
  onClose: () => void;
  onAddRecommendedPlaces?: (recommendedPlaces: RecommendedPlaceDto[]) => void;
}

export function PlaceRecommendationModal({
  visible,
  courseType = 'GENERAL',
  availablePlaces = [],
  onClose,
  onAddRecommendedPlaces,
}: PlaceRecommendationModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // 이미 2개 선택된 경우, 기존 2번째 항목을 대체하거나 경고
        return [prev[0], id];
      }
      return [...prev, id];
    });
  };

  const handleRefresh = () => {
    setSelectedIds([]);
  };

  const handleFetchRecommendation = async () => {
    if (selectedIds.length !== 2) {
      const msg = '추천을 받기 위해 장소 2개를 선택해주세요.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('알림', msg);
      return;
    }

    // ID 숫자로 변환 (숫자 추출 또는 인덱스 기반 파싱)
    const parseIdToNumber = (idStr: string, defaultNum: number): number => {
      const num = parseInt(idStr.replace(/\D/g, ''), 10);
      return isNaN(num) || num === 0 ? defaultNum : num;
    };

    const firstIdx = availablePlaces.findIndex((p) => p.id === selectedIds[0]);
    const secondIdx = availablePlaces.findIndex((p) => p.id === selectedIds[1]);

    const startCoursePlaceId = parseIdToNumber(selectedIds[0], firstIdx >= 0 ? firstIdx + 1 : 1);
    const endCoursePlaceId = parseIdToNumber(selectedIds[1], secondIdx >= 0 ? secondIdx + 1 : 2);

    setIsLoading(true);
    try {
      const recommendedPlaces = await getBetweenRecommendation(courseType, {
        startCoursePlaceId,
        endCoursePlaceId,
      });

      if (onAddRecommendedPlaces) {
        onAddRecommendedPlaces(recommendedPlaces);
      }
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : '장소 추천 불러오기에 실패했습니다.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('오류', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.recommendModalOverlay}>
        <Pressable style={styles.recommendModalBackdrop} onPress={onClose} />

        <View style={styles.recommendModalContent}>
          {/* Header Row */}
          <View style={styles.recommendHeaderRow}>
            <ThemedText style={styles.recommendModalTitle}>장소 추천</ThemedText>
            <Pressable onPress={handleRefresh} hitSlop={8} style={styles.recommendRefreshBtn}>
              <RefreshIcon width={22} height={22} />
            </Pressable>
          </View>

          {/* Subtitle */}
          <ThemedText style={styles.recommendModalSubtitle}>
            선택한 두 장소 사이에 갈 만한 장소를 추천드릴게요! (2개 선택)
          </ThemedText>

          {/* Place Options List */}
          <View style={styles.recommendOptionList}>
            {availablePlaces.length === 0 ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 13, color: '#999999' }}>
                  먼저 2개 이상의 장소를 경로에 추가해주세요.
                </ThemedText>
              </View>
            ) : (
              availablePlaces.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => handleToggle(opt.id)}
                    style={({ pressed }) => [styles.recommendOptionItem, pressed && styles.pressed]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                      {opt.tag ? (
                        <ThemedText style={{ fontSize: 12, color: '#E06635', fontWeight: '700' }}>
                          [{opt.tag}]
                        </ThemedText>
                      ) : null}
                      <ThemedText style={styles.recommendOptionName} numberOfLines={1}>
                        {opt.name}
                      </ThemedText>
                    </View>
                    {isSelected ? (
                      <CheckedRadioIcon width={20} height={20} />
                    ) : (
                      <EmptyRadioIcon width={20} height={20} />
                    )}
                  </Pressable>
                );
              })
            )}
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleFetchRecommendation}
            disabled={isLoading}
            style={({ pressed }) => [styles.recommendSubmitBtn, pressed && styles.pressed]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={styles.recommendSubmitBtnText}>장소 추천받기</ThemedText>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
