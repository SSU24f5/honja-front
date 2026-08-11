import { useEffect, useRef, useState } from 'react';
import { Platform, PanResponder, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DragThreeIcon from '@/assets/icon/basic/drag_three.svg';
import LeftBackIcon from '@/assets/icon/basic/left_back.svg';
import { ThemedText } from '@/components/common/themed-text';
import type { RoutePlace } from '@/stores/routeStore';
import { Spacing } from '@/styles/theme';
import { styles } from './createRouteStyles';

interface WaypointManagementScreenProps {
  routeName: string;
  waypoints: RoutePlace[];
  onBack: () => void;
  onAddWaypoint: () => void;
  onReorderWaypoints?: (newWaypoints: RoutePlace[]) => void;
  onOpenRecommendation: () => void;
  onOpenRouteRecommendation?: () => void;
}

const ITEM_ROW_HEIGHT = 64; // Approx height of card + gap

export function WaypointManagementScreen({
  routeName,
  waypoints,
  onBack,
  onAddWaypoint,
  onReorderWaypoints,
  onOpenRecommendation,
  onOpenRouteRecommendation,
}: WaypointManagementScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const [items, setItems] = useState<RoutePlace[]>(waypoints);
  const [activeDragIdx, setActiveDragIdx] = useState<number | null>(null);

  const containerPaddingTop = Platform.select({
    android: safeAreaInsets.top + Spacing.two,
    ios: safeAreaInsets.top + Spacing.one,
    web: Spacing.four,
    default: safeAreaInsets.top + Spacing.two,
  });

  const containerPaddingBottom = Platform.select({
    android: Spacing.two,
    ios: Spacing.two,
    web: Spacing.three,
    default: Spacing.two,
  });

  // Sync internal state if prop changes from outside
  useEffect(() => {
    setItems(waypoints);
  }, [waypoints]);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const activeIdxRef = useRef<number | null>(null);
  const totalDyRef = useRef<number>(0);

  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        activeIdxRef.current = index;
        totalDyRef.current = 0;
        setActiveDragIdx(index);
      },
      onPanResponderMove: (_, gestureState) => {
        const currentIdx = activeIdxRef.current;
        if (currentIdx === null) return;

        totalDyRef.current = gestureState.dy;
        const offsetSteps = Math.round(gestureState.dy / ITEM_ROW_HEIGHT);
        const targetIdx = currentIdx + offsetSteps;

        const currentList = itemsRef.current;
        if (targetIdx >= 0 && targetIdx < currentList.length && targetIdx !== currentIdx) {
          const newList = [...currentList];
          const [movedItem] = newList.splice(currentIdx, 1);
          newList.splice(targetIdx, 0, movedItem);

          activeIdxRef.current = targetIdx;
          setItems(newList);
          if (onReorderWaypoints) {
            onReorderWaypoints(newList);
          }
        }
      },
      onPanResponderRelease: () => {
        activeIdxRef.current = null;
        totalDyRef.current = 0;
        setActiveDragIdx(null);
        if (onReorderWaypoints) {
          onReorderWaypoints(itemsRef.current);
        }
      },
      onPanResponderTerminate: () => {
        activeIdxRef.current = null;
        totalDyRef.current = 0;
        setActiveDragIdx(null);
        if (onReorderWaypoints) {
          onReorderWaypoints(itemsRef.current);
        }
      },
    });

  return (
    <View
      style={[
        styles.waypointPageContainer,
        { paddingTop: containerPaddingTop, paddingBottom: containerPaddingBottom },
      ]}
    >
      {/* Top Header */}
      <View style={styles.waypointHeaderRow}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.waypointBackBtn}>
          <LeftBackIcon width={12} height={18} />
        </Pressable>
      </View>

      {/* Subtitle / Title */}
      <View style={styles.waypointTitleContainer}>
        <ThemedText style={styles.waypointTitleBold}>중간 경로</ThemedText>
        <ThemedText style={styles.waypointTitleDot}>·</ThemedText>
        <ThemedText style={styles.waypointTitleSub}>{routeName || '혼자왔어유'}</ThemedText>
      </View>

      {/* Waypoint List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.waypointListContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={activeDragIdx === null}
      >
        {items.map((wp, idx) => {
          const panResponder = createPanResponder(idx);
          const isDragging = activeDragIdx === idx;

          return (
            <View
              key={wp.id}
              style={[styles.waypointRowContainer, isDragging && styles.waypointRowDragging]}
            >
              {/* Waypoint Place Card */}
              <View style={styles.waypointCardItem}>
                <ThemedText style={styles.waypointCardText}>{wp.name}</ThemedText>
              </View>

              {/* Drag Handle Icon (= / drag_three.svg) */}
              <View {...panResponder.panHandlers} style={styles.waypointDragHandleBtn} hitSlop={8}>
                <DragThreeIcon width={18} height={12} />
              </View>
            </View>
          );
        })}

        {/* Placeholder / Add Waypoint Box */}
        <Pressable
          onPress={onAddWaypoint}
          style={({ pressed }) => [styles.waypointAddBox, pressed && styles.pressed]}
        >
          <ThemedText style={styles.waypointAddText}>중간 경로를 추가해주세요.</ThemedText>
        </Pressable>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.waypointFooterRow}>
        <Pressable
          onPress={onOpenRouteRecommendation}
          style={({ pressed }) => [styles.routeRecommendBtn, pressed && styles.pressed]}
        >
          <ThemedText style={styles.bottomBtnText}>경로 추천 받기</ThemedText>
        </Pressable>

        <Pressable
          onPress={onOpenRecommendation}
          style={({ pressed }) => [styles.placeRecommendBtn, pressed && styles.pressed]}
        >
          <ThemedText style={styles.bottomBtnText}>장소 추천 받기</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
