import { useRouter } from 'expo-router';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { DeleteConfirmModal } from '@/components/route/DeleteConfirmModal';
import { TripCard, type TripCardData } from '@/components/route/TripCard';
import { useTheme } from '@/hooks/use-theme';
import { type SavedRoute, useRouteStore } from '@/stores/routeStore';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';

// store의 SavedRoute -> 카드가 원하는 형태로 변환
function toTripCardData(route: SavedRoute): TripCardData {
  return {
    id: route.id,
    tags: route.tags,
    title: route.name,
    description: route.description,
    dateRangeText: `${route.dates} (${route.duration})`,
    avatars: route.avatars,
  };
}

// TabButton과 동일한 패턴: TabTrigger가 넘겨주는 props(onPress 등)를 Pressable에 그대로 전달
function InvitationTrigger({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();

  return (
    <Pressable {...props}>
      <ThemedView style={styles.iconButton}>
        <AppIcon name="envelope" size={20} color={theme.text} />
      </ThemedView>
    </Pressable>
  );
}

export function MyTripsScreen() {
  const savedRoutes = useRouteStore((state) => state.savedRoutes);
  const deleteRoute = useRouteStore((state) => state.deleteRoute);
  const [targetTrip, setTargetTrip] = useState<TripCardData | null>(null);
  const theme = useTheme();

  const trips = savedRoutes.map(toTripCardData);

  const router = useRouter();

  const handleConfirmDelete = () => {
    if (!targetTrip) return;
    deleteRoute(targetTrip.id);
    setTargetTrip(null);
  };

  const handleCreateTrip = () => {
    router.push('/route/create' as any);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView
        type="backgroundElement"
        style={[styles.container, { backgroundColor: TripColors.screenBackground }]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <ThemedText
              type="subtitle"
              style={[styles.headerTitle, { color: TripColors.titleText }]}
            >
              내 여행
            </ThemedText>
            <TabTrigger name="invitation" asChild>
              <InvitationTrigger />
            </TabTrigger>
          </View>

          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripCard trip={item} onRequestDelete={setTargetTrip} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

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
    lineHeight: 28,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
