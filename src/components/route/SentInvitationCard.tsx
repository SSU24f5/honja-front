import { type ImageSourcePropType, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';
import { AvatarStack } from './AvatarStack';
import { TagBadge } from './TagBadge';

export interface SentInvitationData {
  id: string;
  tags: string[];
  title: string;
  dateRangeText: string;
  avatars?: ImageSourcePropType[];
}

interface SentInvitationCardProps {
  invitation: SentInvitationData;
}

// '초대한 여행' 섹션용 - 스와이프 없는 정적 카드
export function SentInvitationCard({ invitation }: SentInvitationCardProps) {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.tagRow}>
        {invitation.tags.map((tag) => (
          <TagBadge key={tag} label={tag} />
        ))}
      </View>

      <View style={styles.titleRow}>
        <AvatarStack avatars={invitation.avatars ?? []} />
        <ThemedText type="subtitle" style={[styles.title, { color: TripColors.titleText }]} numberOfLines={1}>
          {invitation.title}
        </ThemedText>
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {invitation.dateRangeText}
      </ThemedText>
    </ThemedView>
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
});