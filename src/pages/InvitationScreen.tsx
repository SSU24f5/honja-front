import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { ConfirmModal } from '@/components/route/Confirmmodal';
import { InvitationCard } from '@/components/route/InvitationCard';
import { SentInvitationCard } from '@/components/route/SentInvitationCard';
import { type Invitation, useInvitationStore } from '@/stores/Invitationstore';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';

export function InvitationScreen() {
  const receivedInvitations = useInvitationStore((state) => state.receivedInvitations);
  const sentInvitations = useInvitationStore((state) => state.sentInvitations);
  const acceptInvitation = useInvitationStore((state) => state.acceptInvitation);
  const rejectInvitation = useInvitationStore((state) => state.rejectInvitation);

  const [acceptTarget, setAcceptTarget] = useState<Invitation | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Invitation | null>(null);

  const handleConfirmAccept = () => {
    if (!acceptTarget) return;
    acceptInvitation(acceptTarget.id);
    setAcceptTarget(null);
  };

  const handleConfirmReject = () => {
    if (!rejectTarget) return;
    rejectInvitation(rejectTarget.id);
    setRejectTarget(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView
        type="backgroundElement"
        style={[styles.container, { backgroundColor: TripColors.screenBackground }]}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText
              type="subtitle"
              style={[styles.headerTitle, { color: TripColors.titleText }]}
            >
              여행 초대장
            </ThemedText>

            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              초대받은 여행
            </ThemedText>
            <View style={styles.list}>
              {receivedInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onRequestAccept={setAcceptTarget}
                  onRequestReject={setRejectTarget}
                />
              ))}
            </View>

            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              초대한 여행
            </ThemedText>
            <View style={styles.list}>
              {sentInvitations.map((invitation) => (
                <SentInvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </View>
          </ScrollView>

          <ConfirmModal
            visible={acceptTarget !== null}
            message="여행 초대를 수락하시겠습니까?"
            confirmLabel="수락"
            confirmColor={TripColors.success}
            onCancel={() => setAcceptTarget(null)}
            onConfirm={handleConfirmAccept}
          />

          <ConfirmModal
            visible={rejectTarget !== null}
            message="여행 초대를 거부하시겠습니까?"
            confirmLabel="거부"
            onCancel={() => setRejectTarget(null)}
            onConfirm={handleConfirmReject}
          />
        </SafeAreaView>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 28,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 14,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  list: {
    marginBottom: Spacing.four,
  },
});
