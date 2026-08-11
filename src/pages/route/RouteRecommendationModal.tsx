import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, View } from 'react-native';
import RefreshIcon from '@/assets/icon/basic/refresh.svg';
import {
  getRouteRecommendation,
  type RouteRecommendationPlace,
  type RouteRecommendationResponse,
} from '@/api/recommendation';
import { ThemedText } from '@/components/common/themed-text';
import type { RoutePlace } from '@/stores/routeStore';
import { styles } from './createRouteStyles';

interface RouteRecommendationModalProps {
  visible: boolean;
  courseId: number;
  date: string; // YYYY-MM-DD
  startPlace?: RoutePlace | null;
  endPlace?: RoutePlace | null;
  currentWaypoints: RoutePlace[];
  onClose: () => void;
  onApplyRouteOrder?: (orderedWaypoints: RoutePlace[]) => void;
}

export function RouteRecommendationModal({
  visible,
  courseId,
  date,
  startPlace,
  endPlace,
  currentWaypoints,
  onClose,
  onApplyRouteOrder,
}: RouteRecommendationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RouteRecommendationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    if (!startPlace || !endPlace) {
      setErrorMsg('경로 추천을 위해 출발지와 도착지를 먼저 추가해주세요.');
      return;
    }

    const targetCourseId = courseId && !isNaN(courseId) && courseId > 0 ? courseId : 1;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getRouteRecommendation({ courseId: targetCourseId, date });
      setRecommendation(res);
    } catch (err) {
      console.log('[RouteRecommendation Error]', err);
      const msg = err instanceof Error ? err.message : '경로 추천을 불러오지 못했습니다.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically fetch when modal opens
  useEffect(() => {
    if (visible) {
      fetchRecommendation();
    } else {
      setRecommendation(null);
      setErrorMsg(null);
    }
  }, [visible]);

  // Match recommended place to currentWaypoints or generate place item
  const displayPlaces = recommendation?.places ?? [];

  const getPlaceInfo = (
    item: RouteRecommendationPlace,
    index: number,
  ): { name: string; tag?: string } => {
    if (item.orderType === 'START' && startPlace) {
      return { name: item.title || startPlace.name, tag: '출발지' };
    }
    if (item.orderType === 'END' && endPlace) {
      return { name: item.title || endPlace.name, tag: '도착지' };
    }
    const matched = currentWaypoints.find(
      (wp) =>
        wp.id === String(item.coursePlaceId) ||
        wp.id === String(item.placeId) ||
        wp.id.includes(String(item.coursePlaceId)),
    );
    if (matched) return { name: item.title || matched.name, tag: '중간' };
    if (item.title) return { name: item.title, tag: '중간' };
    if (currentWaypoints[index]) return { name: currentWaypoints[index].name, tag: '중간' };
    return { name: `추천 장소 ${index + 1}` };
  };

  const handleApply = () => {
    if (!displayPlaces.length) {
      onClose();
      return;
    }

    // Reorder waypoints based on API order (filtering out start and end from waypoints array)
    const orderedWaypoints: RoutePlace[] = [];
    displayPlaces.forEach((item, index) => {
      if (item.orderType !== 'START' && item.orderType !== 'END') {
        const matched = currentWaypoints.find(
          (wp) =>
            wp.id === String(item.coursePlaceId) ||
            wp.id === String(item.placeId) ||
            wp.id.includes(String(item.coursePlaceId)),
        );
        if (matched) {
          orderedWaypoints.push(matched);
        } else if (currentWaypoints[index]) {
          orderedWaypoints.push(currentWaypoints[index]);
        }
      }
    });

    // Add any remaining waypoints that weren't included in the recommended list
    currentWaypoints.forEach((wp) => {
      if (!orderedWaypoints.some((p) => p.id === wp.id)) {
        orderedWaypoints.push(wp);
      }
    });

    if (onApplyRouteOrder) {
      onApplyRouteOrder(orderedWaypoints.length > 0 ? orderedWaypoints : currentWaypoints);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.recommendModalOverlay}>
        <Pressable style={styles.recommendModalBackdrop} onPress={onClose} />

        <View style={styles.recommendModalContent}>
          {/* Header Row */}
          <View style={styles.recommendHeaderRow}>
            <ThemedText style={styles.recommendModalTitle}>경로 추천</ThemedText>
            <Pressable
              onPress={fetchRecommendation}
              disabled={isLoading}
              hitSlop={8}
              style={styles.recommendRefreshBtn}
            >
              <RefreshIcon width={22} height={22} />
            </Pressable>
          </View>

          {/* Body Content */}
          {isLoading ? (
            <View style={{ paddingVertical: 36, alignItems: 'center', gap: 12 }}>
              <ActivityIndicator size="large" color="#DF7B38" />
              <ThemedText
                style={{ fontSize: 14, color: '#DF7B38', fontWeight: '700', textAlign: 'center' }}
              >
                최적의 방문 순서를 계산 중입니다...
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: '#999999', textAlign: 'center' }}>
                출발지/도착지를 고려한 최적 경로 생성 중 🚀
              </ThemedText>
            </View>
          ) : errorMsg ? (
            <View style={{ paddingVertical: 24, alignItems: 'center', gap: 10 }}>
              <ThemedText style={{ fontSize: 14, color: '#FF3B30', textAlign: 'center' }}>
                {errorMsg}
              </ThemedText>
              {startPlace && endPlace ? (
                <Pressable
                  onPress={fetchRecommendation}
                  style={{
                    backgroundColor: '#FCEFE9',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                >
                  <ThemedText style={{ color: '#DF7B38', fontWeight: '700', fontSize: 13 }}>
                    다시 시도
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <View style={{ gap: 10, marginVertical: 8 }}>
              {displayPlaces.length === 0 ? (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <ThemedText style={{ fontSize: 13, color: '#999999' }}>
                    추천된 경로 정보가 없습니다.
                  </ThemedText>
                </View>
              ) : (
                displayPlaces.map((item, idx) => {
                  const placeInfo = getPlaceInfo(item, idx);
                  const hasMeta = item.distance && item.distance !== '0';
                  return (
                    <View
                      key={item.coursePlaceId || idx}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        backgroundColor: '#F8F9FA',
                        borderRadius: 12,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          flex: 1,
                        }}
                      >
                        <ThemedText style={{ fontSize: 15, fontWeight: '800', color: '#DF7B38' }}>
                          {idx + 1}.
                        </ThemedText>
                        {placeInfo.tag ? (
                          <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#E06635' }}>
                            [{placeInfo.tag}]
                          </ThemedText>
                        ) : null}
                        <ThemedText
                          style={{ fontSize: 14, fontWeight: '600', color: '#222222', flex: 1 }}
                          numberOfLines={1}
                        >
                          {placeInfo.name}
                        </ThemedText>
                      </View>
                      {hasMeta ? (
                        <ThemedText style={{ fontSize: 12, color: '#8E8E93', marginLeft: 8 }}>
                          {item.distance} {item.timeTaken ? `· ${item.timeTaken}` : ''}
                        </ThemedText>
                      ) : null}
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* Submit Button */}
          <Pressable
            onPress={handleApply}
            disabled={isLoading || displayPlaces.length === 0}
            style={({ pressed }) => [
              styles.recommendSubmitBtn,
              (isLoading || displayPlaces.length === 0) && { backgroundColor: '#CCCCCC' },
              pressed && styles.pressed,
            ]}
          >
            <ThemedText style={styles.recommendSubmitBtnText}>경로 반영하기</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
