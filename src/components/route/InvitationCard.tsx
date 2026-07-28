import { useRef } from 'react';
import { Animated, type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import { Swipeable } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';
import { AvatarStack } from './AvatarStack';
import { TagBadge } from './TagBadge';

export interface InvitationCardData {
  id: string;
  tags: string[];
  title: string;
  dateRangeText: string;
  avatars?: ImageSourcePropType[];
}

interface InvitationCardProps {
  invitation: InvitationCardData;
  onRequestAccept: (invitation: InvitationCardData) => void;
  onRequestReject: (invitation: InvitationCardData) => void;
}

export function InvitationCard({ invitation, onRequestAccept, onRequestReject }: InvitationCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  // 왼쪽으로 스와이프 -> 오른쪽에 수락(그린) 버튼 노출
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
        style={[styles.actionButton, styles.rightActionButton, { backgroundColor: TripColors.success }]}
        onPress={() => {
          swipeableRef.current?.close();
          onRequestAccept(invitation);
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <AppIcon name="exchange" size={22} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
    );
  };

  // 오른쪽으로 스와이프 -> 왼쪽에 거부(트래시) 버튼 노출
  const renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });

    return (
      <Pressable
        style={[styles.actionButton, styles.leftActionButton, { backgroundColor: TripColors.danger }]}
        onPress={() => {
          swipeableRef.current?.close();
          onRequestReject(invitation);
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <AppIcon name="trash" size={22} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
      friction={2}
    >
      <ThemedView style={styles.card}>
        <View style={styles.tagRow}>
          {invitation.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </View>

        <View style={styles.titleRow}>
          <AvatarStack avatars={invitation.avatars ?? []} />
          <ThemedText
            type="subtitle"
            style={[styles.title, { color: TripColors.titleText }]}
            numberOfLines={1}
          >
            {invitation.title}
          </ThemedText>
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          {invitation.dateRangeText}
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
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    borderRadius: 18,
    marginBottom: Spacing.two + Spacing.half,
  },
  rightActionButton: {
    marginRight: Spacing.three,
  },
  leftActionButton: {
    marginLeft: Spacing.three,
  },
});