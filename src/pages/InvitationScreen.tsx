import { useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { TabTrigger } from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { ParticipateModal } from '@/components/route/ParticipateModal';
import { TripListCard, type TripListCardData } from '@/components/route/TripListCard';
import { type Invitation, useInvitationStore } from '@/stores/invitationStore';
import { Spacing } from '@/styles/theme';

function toTripListCardData(invitation: Invitation): TripListCardData {
  return {
    id: invitation.id,
    tag: invitation.tag,
    title: invitation.title,
    dateRangeText: invitation.dateRangeText,
    avatars: invitation.avatars,
  };
}

// expo-router/ui의 TabTrigger는 웹(app-tabs.web.tsx)의 커스텀 Tabs 안에서만 동작함.
// 네이티브는 일반 expo-router Tabs를 쓰므로 그냥 router.push로 이동.
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
  const receivedInvitations = useInvitationStore((state) => state.receivedInvitations);
  const sentInvitations = useInvitationStore((state) => state.sentInvitations);
  const acceptInvitation = useInvitationStore((state) => state.acceptInvitation);
  const rejectInvitation = useInvitationStore((state) => state.rejectInvitation);

  const [target, setTarget] = useState<TripListCardData | null>(null);

  const handleReject = () => {
    if (!target) return;
    rejectInvitation(target.id);
    setTarget(null);
  };

  const handleParticipate = () => {
    if (!target) return;
    acceptInvitation(target.id);
    setTarget(null);
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
          <View style={styles.list}>
            {receivedInvitations.map((invitation) => (
              <TripListCard
                key={invitation.id}
                trip={toTripListCardData(invitation)}
                onPress={setTarget}
              />
            ))}
          </View>

          <ThemedText style={styles.sectionTitle}>초대한 여행</ThemedText>
          <View style={styles.list}>
            {sentInvitations.map((invitation) => (
              <TripListCard key={invitation.id} trip={toTripListCardData(invitation)} />
            ))}
          </View>
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
});