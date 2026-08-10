import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import { Swipeable } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';
import { AvatarStack } from './AvatarStack';
import { TagBadge } from './TagBadge';

// 카드 렌더링에 필요한 데이터 형태 (stores의 SavedRoute를 매핑해서 넘기면 됨)
export interface TripCardData {
  id: string;
  tags: string[];
  title: string;
  description?: string;
  dateRangeText: string;
  avatars?: ImageSourcePropType[];
}

interface TripCardProps {
  trip: TripCardData;
  onRequestDelete: (trip: TripCardData) => void;
}

export function TripCard({ trip, onRequestDelete }: TripCardProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const theme = useTheme();

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Pressable
        style={[styles.deleteAction, { backgroundColor: TripColors.danger }]}
        onPress={() => {
          swipeableRef.current?.close();
          onRequestDelete(trip);
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <AppIcon name="trash" size={24} color={theme.background} />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <ThemedView style={styles.card}>
        <View style={styles.tagRow}>
          {trip.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </View>

        <View style={styles.titleRow}>
          <AvatarStack avatars={trip.avatars ?? []} />
          <ThemedText
            type="subtitle"
            style={[styles.title, { color: TripColors.titleText }]}
            numberOfLines={1}
          >
            {trip.title}
          </ThemedText>
        </View>

        {trip.description ? (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.description}
            numberOfLines={2}
          >
            {trip.description}
          </ThemedText>
        ) : null}

        <ThemedText type="small" themeColor="textSecondary">
          {trip.dateRangeText}
        </ThemedText>
      </ThemedView>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two + Spacing.half,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: Spacing.one + Spacing.half,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Spacing.half,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'right',
  },
  description: {
    textAlign: 'right',
    marginBottom: Spacing.one,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    borderRadius: 18,
    marginBottom: Spacing.two + Spacing.half,
    marginRight: Spacing.three,
  },
});