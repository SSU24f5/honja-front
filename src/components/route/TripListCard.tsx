import { type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { Spacing } from '@/styles/theme';
import { AvatarStack } from './AvatarStack';
import { TagBadge } from './TagBadge';

export interface TripListCardData {
  id: string;
  /** 동행유형 뱃지 (예: '일반', '배리어프리', '애인과 함께' 등) */
  tag: string;
  title: string;
  description?: string;
  dateRangeText: string;
  avatars?: ImageSourcePropType[];
  /** 아바타 외 추가 인원 수 (있으면 '+N'으로 표시) */
  extraParticipants?: number;
}

interface TripListCardProps {
  trip: TripListCardData;
  /** 카드 전체를 누를 수 있게 하려면 지정 (초대받은 여행 카드 등) */
  onPress?: (trip: TripListCardData) => void;
  /** '···' 메뉴 버튼을 보여주려면 지정 (삭제 등 카드별 액션) */
  onMenuPress?: (trip: TripListCardData) => void;
}

// 여러 화면(내 여행 / 초대받은 여행 / 초대한 여행)에서 공통으로 쓰는 카드
export function TripListCard({ trip, onPress, onMenuPress }: TripListCardProps) {
  const content = (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.dateBadge}>
          <ThemedText style={styles.dateBadgeText} numberOfLines={1}>
            {trip.dateRangeText}
          </ThemedText>
        </View>

        <View style={styles.topRowRight}>
          <TagBadge label={trip.tag} />
          {onMenuPress ? (
            <Pressable hitSlop={8} style={styles.menuButton} onPress={() => onMenuPress(trip)}>
              <AppIcon name="more" size={18} color="#60646C" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ThemedText style={styles.title} numberOfLines={1}>
        {trip.title}
      </ThemedText>

      {trip.description ? (
        <ThemedText style={styles.description} numberOfLines={2}>
          {trip.description}
        </ThemedText>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.avatarRow}>
        <AvatarStack avatars={trip.avatars ?? []} />
        {trip.extraParticipants ? (
          <ThemedText style={styles.extraCount}>+{trip.extraParticipants}</ThemedText>
        ) : null}
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={() => onPress(trip)} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two + Spacing.half,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  dateBadge: {
    backgroundColor: '#EAECEE',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 6,
    flexShrink: 1,
  },
  dateBadgeText: {
    fontSize: 12,
    color: '#60646C',
    fontWeight: '500',
  },
  topRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  menuButton: {
    paddingHorizontal: Spacing.half,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: Spacing.half,
  },
  description: {
    fontSize: 13,
    color: '#60646C',
    marginBottom: Spacing.two,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: Spacing.two,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#60646C',
    marginLeft: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});