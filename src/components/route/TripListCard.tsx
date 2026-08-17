import { type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { Spacing } from '@/styles/theme';
import { AvatarStack } from './AvatarStack';
import { TagBadge } from './TagBadge';

export interface TripListCardData {
  id: string;
  tag?: string;
  title: string;
  description?: string;
  dateRangeText: string;
  avatars?: ImageSourcePropType[];
  extraParticipants?: number;
}

interface TripListCardProps {
  trip: TripListCardData;
  onPress?: (trip: TripListCardData) => void;
  onMenuPress?: (trip: TripListCardData) => void;
}

export function TripListCard({ trip, onPress, onMenuPress }: TripListCardProps) {
  const hasAvatarRow = (trip.avatars && trip.avatars.length > 0) || !!trip.extraParticipants;

  const content = (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.dateBadge}>
          <ThemedText style={styles.dateBadgeText} numberOfLines={1}>
            {trip.dateRangeText}
          </ThemedText>
        </View>

        <View style={styles.topRowRight}>
          {trip.tag ? <TagBadge label={trip.tag} /> : null}
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

      {hasAvatarRow ? (
        <>
          <View style={styles.divider} />
          <View style={styles.avatarRow}>
            <AvatarStack avatars={trip.avatars ?? []} />
            {trip.extraParticipants ? (
              <ThemedText style={styles.extraCount}>+{trip.extraParticipants}</ThemedText>
            ) : null}
          </View>
        </>
      ) : null}
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