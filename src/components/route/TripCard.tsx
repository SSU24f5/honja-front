/**
 * TripCard — MyTripScreen에서 사용하는 카드 컴포넌트.
 * TripListCard 위에 추가 필드(tags, onRequestDelete)를 지원합니다.
 */
import { type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { AppIcon } from '@/components/common/AppIcon';
import { TagBadge } from './TagBadge';
import { AvatarStack } from './AvatarStack';
import { Spacing } from '@/styles/theme';

export interface TripCardData {
  id: string;
  tags?: string[];
  title: string;
  description?: string;
  dateRangeText: string;
  avatars?: ImageSourcePropType[];
  extraParticipants?: number;
}

interface TripCardProps {
  trip: TripCardData;
  onPress?: (trip: TripCardData) => void;
  onRequestDelete?: (trip: TripCardData) => void;
}

export function TripCard({ trip, onPress, onRequestDelete }: TripCardProps) {
  const hasAvatarRow = (trip.avatars && trip.avatars.length > 0) || !!trip.extraParticipants;

  const inner = (
    <View style={styles.card}>
      {/* 상단 행: 날짜 배지 + 태그들 + 삭제 버튼 */}
      <View style={styles.topRow}>
        <View style={styles.dateBadge}>
          <ThemedText style={styles.dateBadgeText} numberOfLines={1}>
            {trip.dateRangeText}
          </ThemedText>
        </View>
        <View style={styles.rightRow}>
          {trip.tags?.map((tag) => <TagBadge key={tag} label={tag} />)}
          {onRequestDelete && (
            <Pressable
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation?.();
                onRequestDelete(trip);
              }}
              style={styles.menuBtn}
            >
              <AppIcon name="more" size={18} color="#60646C" />
            </Pressable>
          )}
        </View>
      </View>

      <ThemedText style={styles.title} numberOfLines={1}>{trip.title}</ThemedText>

      {trip.description ? (
        <ThemedText style={styles.description} numberOfLines={2}>{trip.description}</ThemedText>
      ) : null}

      {hasAvatarRow ? (
        <>
          <View style={styles.divider} />
          <View style={styles.avatarRow}>
            <AvatarStack avatars={trip.avatars ?? []} />
            {trip.extraParticipants ? (
              <ThemedText style={styles.extra}>+{trip.extraParticipants}</ThemedText>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );

  if (!onPress) return inner;

  return (
    <Pressable onPress={() => onPress(trip)} style={({ pressed }) => pressed && styles.pressed}>
      {inner}
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
  dateBadgeText: { fontSize: 12, color: '#60646C', fontWeight: '500' },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  menuBtn: { paddingHorizontal: Spacing.half },
  title: { fontSize: 18, fontWeight: '700', color: '#222222', marginBottom: Spacing.half },
  description: { fontSize: 13, color: '#60646C', marginBottom: Spacing.two },
  divider: { height: 1, backgroundColor: '#E8E8E8', marginBottom: Spacing.two },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  extra: { fontSize: 13, fontWeight: '700', color: '#60646C', marginLeft: Spacing.one },
  pressed: { opacity: 0.7 },
});
