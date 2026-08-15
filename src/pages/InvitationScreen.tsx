import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { TabTrigger } from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { ParticipateModal } from '@/components/route/ParticipateModal';
import { TripListCard, type TripListCardData } from '@/components/route/TripListCard';
import {
  useAcceptInvitation,
  useReceivedInvitations,
  useRejectInvitation,
  useSentInvitations,
} from '@/hooks/use-invitations';
import { formatShortDate } from '@/utils/course-type';
import type { CourseInvitationResponseDto } from '@/api/invitation';
import { Spacing } from '@/styles/theme';

function toReceivedCardData(invitation: CourseInvitationResponseDto): TripListCardData {
  return {
    id: String(invitation.courseMemberId),
    title: invitation.courseName,
    description: invitation.courseDescription,
    dateRangeText: `${invitation.counterpartNickname}님의 초대 · ${formatShortDate(invitation.createdAt)}`,
  };
}

function toSentCardData(invitation: CourseInvitationResponseDto): TripListCardData {
  return {
    id: String(invitation.courseMemberId),
    title: invitation.courseName,
    description: invitation.courseDescription,
    dateRangeText: `${invitation.counterpartNickname}님에게 초대 · ${formatShortDate(invitation.createdAt)}`,
  };
}


function BackButton() {
  const router = useRouter();

  if (Platform.OS === 'web') {
    return (
      <TabTrigger name="route" asChild>
        <Pressable hitSlop={8} style={styles.backButton}>
          <AppIcon name="chevronLeft" size={22} color="#222222" />
        </Pressable>
      </TabTrigger>
    );
  }

  return (
    <Pressable hitSlop={8} style={styles.backButton} onPress={() => router.push('/route')}>
      <AppIcon name="chevronLeft" size={22} color="#222222" />
    </Pressable>
  );
}

export function InvitationScreen() {
  const {
    data: receivedInvitations,
    isLoading: isReceivedLoading,
  } = useReceivedInvitations();
  const { data: sentInvitations, isLoading: isSentLoading } = useSentInvitations();
  const acceptMutation = useAcceptInvitation();
  const rejectMutation = useRejectInvitation();

  const [target, setTarget] = useState<TripListCardData | null>(null);

  const pendingReceived = (receivedInvitations ?? []).filter((inv) => inv.status === 'PENDING');
  const pendingSent = (sentInvitations ?? []).filter((inv) => inv.status === 'PENDING');

  const handleReject = () => {
    if (!target) return;
    rejectMutation.mutate(Number(target.id), {
      onSettled: () => setTarget(null),
    });
  };

  const handleParticipate = () => {
    if (!target) return;
    acceptMutation.mutate(Number(target.id), {
      onSettled: () => setTarget(null),
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton />
          <ThemedText style={styles.headerTitle}>여행 초대장</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.sectionTitle}>초대받은 여행</ThemedText>
          {isReceivedLoading ? (
            <ActivityIndicator style={styles.loading} color="#FF6623" />
          ) : (
            <View style={styles.list}>
              {pendingReceived.map((invitation) => (
                <TripListCard
                  key={invitation.courseMemberId}
                  trip={toReceivedCardData(invitation)}
                  onPress={setTarget}
                />
              ))}
              {pendingReceived.length === 0 ? (
                <ThemedText style={styles.emptyText}>받은 초대가 없어요</ThemedText>
              ) : null}
            </View>
          )}

          <ThemedText style={styles.sectionTitle}>초대안 여행</ThemedText>
          {isSentLoading ? (
            <ActivityIndicator style={styles.loading} color="#FF6623" />
          ) : (
            <View style={styles.list}>
              {pendingSent.map((invitation) => (
                <TripListCard
                  key={invitation.courseMemberId}
                  trip={toSentCardData(invitation)}
                />
              ))}
              {pendingSent.length === 0 ? (
                <ThemedText style={styles.emptyText}>보낸 초대가 없어요</ThemedText>
              ) : null}
            </View>
          )}
        </ScrollView>

        <ParticipateModal
          visible={target !== null}
          tripTitle={target?.title ?? ''}
          onReject={handleReject}
          onParticipate={handleParticipate}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  backButton: {
    paddingRight: Spacing.two,
    paddingVertical: Spacing.one,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222222',
  },
  scrollContent: {
    paddingBottom: Spacing.five,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60646C',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  list: {
    marginBottom: Spacing.four,
  },
  loading: {
    marginBottom: Spacing.four,
  },
  emptyText: {
    fontSize: 13,
    color: '#AAAAAA',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
});