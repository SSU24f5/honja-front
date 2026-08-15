import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useDeleteCourse, useMyCourses } from '@/hooks/use-my-courses';
import { useReceivedInvitations } from '@/hooks/use-invitations';
import { getCourseTypeLabel, formatDateRangeWithDuration } from '@/utils/course-type';
import type { CourseListResponseDto } from '@/api/course';
import type { InviteStatus } from '@/api/invitation';
import { TripListCard, type TripListCardData } from '@/components/route/TripListCard';
import { DeleteConfirmModal } from '@/components/route/DeleteConfirmModal';
import { EmptyTripsState } from '@/components/route/EmptyTripsState';

const MAX_VISIBLE_AVATARS = 3;

function toTripListCardData(course: CourseListResponseDto): TripListCardData {
  const visibleAvatars = course.profiles.slice(0, MAX_VISIBLE_AVATARS).map((uri) => ({ uri }));
  const extraCount = Math.max(0, course.profiles.length - MAX_VISIBLE_AVATARS);

  return {
    id: String(course.id),
    tag: getCourseTypeLabel(course.courseType),
    title: course.name,
    description: course.description,
    dateRangeText: formatDateRangeWithDuration(course.startDate, course.endDate),
    avatars: visibleAvatars,
    extraParticipants: extraCount,
  };
}

function EnvelopeButtonContent({ hasInvitations }: { hasInvitations: boolean }) {
  return (
    <ThemedView style={[styles.iconButton, hasInvitations && styles.iconButtonActive]}>
      <AppIcon name="envelope" size={20} color={hasInvitations ? '#FFFFFF' : '#AEB4BC'} />
    </ThemedView>
  );
}

function InvitationButton() {
  const { data: receivedInvitations } = useReceivedInvitations();
  const hasInvitations =
    receivedInvitations?.some((inv) => inv.status === ('PENDING' satisfies InviteStatus)) ?? false;
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
  const { data: courses, isLoading, isError, error } = useMyCourses();
  const deleteCourseMutation = useDeleteCourse();
  const [targetTrip, setTargetTrip] = useState<TripListCardData | null>(null);
  const theme = useTheme();
  const router = useRouter();

  const trips = (courses ?? []).map(toTripListCardData);

  const handleConfirmDelete = () => {
    if (!targetTrip) return;
    deleteCourseMutation.mutate(Number(targetTrip.id), {
      onSettled: () => setTargetTrip(null),
    });
  };

  const handleCreateTrip = () => {
    router.push('/route/create' as never);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>내 여행</ThemedText>
          <InvitationButton />
        </View>

        {isLoading ? (
          <View style={styles.centerArea}>
            <ActivityIndicator size="large" color="#FF6623" />
          </View>
        ) : isError ? (
          <View style={styles.centerArea}>
            <ThemedText style={styles.errorText}>
              {error instanceof Error ? error.message : '여행 목록을 불러오지 못했어요.'}
            </ThemedText>
          </View>
        ) : trips.length === 0 ? (
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
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  errorText: {
    color: '#60646C',
    textAlign: 'center',
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