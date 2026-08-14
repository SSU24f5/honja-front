import { useState } from 'react';
import { FlatList, Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useRouteStore, type SavedRoute } from '@/stores/routeStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { TripListCard, type TripListCardData } from '@/components/route/TripListCard';
import { DeleteConfirmModal } from '@/components/route/DeleteConfirmModal';
import { EmptyTripsState } from '@/components/route/EmptyTripsState';

// store의 SavedRoute -> 카드가 원하는 형태로 변환
function toTripListCardData(route: SavedRoute): TripListCardData {
  return {
    id: route.id,
    tag: route.tag,
    title: route.name,
    description: route.description,
    dateRangeText: `${route.dates} (${route.duration})`,
    avatars: route.avatars,
  };
}

function EnvelopeButtonContent({ hasInvitations }: { hasInvitations: boolean }) {
  return (
    <ThemedView
      style={[styles.iconButton, hasInvitations && styles.iconButtonActive]}
    >
      <AppIcon name="envelope" size={20} color={hasInvitations ? '#FFFFFF' : '#AEB4BC'} />
    </ThemedView>
  );
}

// expo-router/ui의 TabTrigger는 웹(app-tabs.web.tsx)의 커스텀 Tabs 안에서만 동작함.
// 네이티브는 일반 expo-router Tabs를 쓰므로 그냥 router.push로 이동해야 크래시가 안 남.
function InvitationButton() {
  const hasInvitations = useInvitationStore((state) => state.receivedInvitations.length > 0);
  const router = useRouter();

  if (Platform.OS === 'web') {
    return (
      <TabTrigger name="invitation" asChild>
        <WebInvitationTrigger hasInvitations={hasInvitations} />
      </TabTrigger>
    );
  }

  return (
    <Pressable onPress={() => router.push('/invitation')}>
      <EnvelopeButtonContent hasInvitations={hasInvitations} />
    </Pressable>
  );
}

// TabButton과 동일한 패턴: TabTrigger가 넘겨주는 props(onPress 등)를 Pressable에 그대로 전달 (웹 전용)
function WebInvitationTrigger({
  hasInvitations,
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps & { hasInvitations: boolean }) {
  return (
    <Pressable {...props}>
      <EnvelopeButtonContent hasInvitations={hasInvitations} />
    </Pressable>
  );
}

export function MyTripsScreen() {
  const savedRoutes = useRouteStore((state) => state.savedRoutes);
  const deleteRoute = useRouteStore((state) => state.deleteRoute);
  const [targetTrip, setTargetTrip] = useState<TripListCardData | null>(null);
  const theme = useTheme();

  const trips = savedRoutes.map(toTripListCardData);

  const handleConfirmDelete = () => {
    if (!targetTrip) return;
    deleteRoute(targetTrip.id);
    setTargetTrip(null);
  };

  const handleCreateTrip = () => {
    // TODO: 여행 생성 화면으로 이동 (라우팅은 추후 연결)
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>내 여행</ThemedText>
          <InvitationButton />
        </View>

        {trips.length === 0 ? (
          <EmptyTripsState />
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripListCard trip={item} onMenuPress={setTargetTrip} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.bottomArea}>
          <Pressable
            style={[styles.createButton, { backgroundColor: theme.brandPrimary }]}
            onPress={handleCreateTrip}
          >
            <ThemedText type="default" themeColor="background" style={styles.createButtonText}>
              여행 생성하기
            </ThemedText>
          </Pressable>
        </View>

        <DeleteConfirmModal
          visible={targetTrip !== null}
          onCancel={() => setTargetTrip(null)}
          onConfirm={handleConfirmDelete}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222222',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconButtonActive: {
    backgroundColor: '#FF6623',
    borderColor: '#FF6623',
  },
  listContent: {
    paddingTop: Spacing.half,
    paddingBottom: Spacing.four,
  },
  bottomArea: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    paddingTop: Spacing.one,
  },
  createButton: {
    borderRadius: 28,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontWeight: '700',
  },
});