import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { PlaceReorderList } from '@/components/route/PlaceReorderList';
import { RoutePlanner } from '@/components/route/RoutePlanner';
import { useTheme } from '@/hooks/use-theme';
import { useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';

type StepType = 'list' | 'create_form' | 'add_places' | 'reorder' | 'details';

export default function RouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const { savedRoutes, itinerary, createRoute, clearItinerary } = useRouteStore();

  const [step, setStep] = useState<StepType>('list');
  const [routeName, setRouteName] = useState('제주 동부 힐링 일정');
  const [routeDates, setRouteDates] = useState('26.07.12. ~ 26.07.15.');
  const [routeDuration, setRouteDuration] = useState('3박 4일');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  const selectedRoute = savedRoutes.find((r) => r.id === selectedRouteId) || savedRoutes[0];

  const handleStartCreate = () => {
    clearItinerary();
    setStep('create_form');
  };

  const handleSaveRoute = () => {
    if (itinerary.length < 2) {
      const msg = '일정에 최소 2개 이상의 장소를 추가해 주세요.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('알림', msg);
      return;
    }
    createRoute(routeName, routeDates, routeDuration);
    setStep('list');
  };

  const handleRecommendSequence = () => {
    const msg = 'AI가 최적의 방문 순서를 추천하여 일정을 정렬했습니다.';
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert('알림', msg);
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        {/* STEP 1: ROUTE LIST */}
        {step === 'list' && (
          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                내 경로
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                내가 계획한 제주도 여행 일정 리스트
              </ThemedText>
            </ThemedView>

            <View style={styles.list}>
              {savedRoutes.map((route) => (
                <ThemedView key={route.id} style={styles.routeCard} type="backgroundElement">
                  <ThemedView style={styles.routeCardHeader}>
                    <SymbolView name="map.fill" tintColor="#D36D3A" size={18} />
                    <ThemedText type="smallBold" style={styles.routeNameText}>
                      {route.name}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.routeDates}>
                    {route.dates} ({route.duration})
                  </ThemedText>
                  <ThemedText
                    type="small"
                    themeColor="textSecondary"
                    style={styles.routeDestinations}
                  >
                    경유지: {route.itinerary.map((p) => p.name).join(' → ')}
                  </ThemedText>
                  <ThemedView style={styles.routeCardActions}>
                    <Pressable
                      onPress={() => {
                        setSelectedRouteId(route.id);
                        setStep('details');
                      }}
                      style={({ pressed }) => [
                        styles.cardBtn,
                        styles.cardBtnPrimary,
                        pressed && styles.pressed,
                      ]}
                    >
                      <ThemedText style={styles.cardBtnTextPrimary}>상세 보기</ThemedText>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.cardBtn,
                        styles.cardBtnSecondary,
                        pressed && styles.pressed,
                      ]}
                    >
                      <ThemedText style={styles.cardBtnTextSecondary}>지도 보기</ThemedText>
                    </Pressable>
                  </ThemedView>
                </ThemedView>
              ))}
            </View>

            <Pressable
              onPress={handleStartCreate}
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            >
              <ThemedText style={styles.actionBtnText}>경로 생성하기</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* STEP 2: CREATE ROUTE FORM */}
        {step === 'create_form' && (
          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                일정 정보 입력
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                제주 여행의 기본 정보를 입력해 주세요
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.formCard} type="backgroundElement">
              <View style={styles.formItem}>
                <ThemedText type="smallBold" style={styles.formLabel}>
                  일정 이름
                </ThemedText>
                <TextInput
                  value={routeName}
                  onChangeText={setRouteName}
                  style={styles.formInput}
                  placeholder="예: 혼저옵서예"
                />
              </View>

              <View style={styles.formItem}>
                <ThemedText type="smallBold" style={styles.formLabel}>
                  일정 날짜
                </ThemedText>
                <TextInput
                  value={routeDates}
                  onChangeText={setRouteDates}
                  style={styles.formInput}
                  placeholder="예: 26.07.10. ~ 26.07.14."
                />
              </View>

              <View style={styles.formItem}>
                <ThemedText type="smallBold" style={styles.formLabel}>
                  여행 기간
                </ThemedText>
                <TextInput
                  value={routeDuration}
                  onChangeText={setRouteDuration}
                  style={styles.formInput}
                  placeholder="예: 4박 5일"
                />
              </View>
            </ThemedView>

            <ThemedView style={styles.actionsRow}>
              <Pressable
                onPress={() => setStep('add_places')}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.actionBtnText}>장소 추가하기</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setStep('list')}
                style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.cancelBtnText}>취소</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        )}

        {/* STEP 3: ADD/SEARCH PLACES */}
        {step === 'add_places' && (
          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                방문 장소 추가
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                일정에 추가할 장소를 골라 담아보세요
              </ThemedText>
            </ThemedView>

            <RoutePlanner />

            <ThemedView style={styles.actionsRow}>
              <Pressable
                onPress={() => setStep('reorder')}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.actionBtnText}>장소 순서 정하기</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setStep('create_form')}
                style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.cancelBtnText}>이전으로</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        )}

        {/* STEP 4: REORDER & OPTIMIZE */}
        {step === 'reorder' && (
          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                방문 순서 정하기
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                장소를 원하는 방문 순서대로 조정해 주세요
              </ThemedText>
            </ThemedView>

            <PlaceReorderList />

            <Pressable
              onPress={handleRecommendSequence}
              style={({ pressed }) => [styles.optBtn, pressed && styles.pressed]}
            >
              <SymbolView name="sparkles" tintColor="#FFFFFF" size={16} />
              <ThemedText style={styles.optBtnText}>방문 순서 추천받기</ThemedText>
            </Pressable>

            <ThemedView style={styles.actionsRow}>
              <Pressable
                onPress={handleSaveRoute}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.actionBtnText}>완성된 경로 저장하기</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setStep('add_places')}
                style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.cancelBtnText}>이전으로</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        )}

        {/* STEP 5: ROUTE DETAILS */}
        {step === 'details' && selectedRoute && (
          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                {selectedRoute.name} 상세
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                {selectedRoute.dates} ({selectedRoute.duration})
              </ThemedText>
            </ThemedView>

            {/* Split Mock Map & Path lines */}
            <ThemedView style={styles.detailsMapMock} type="backgroundElement">
              <ThemedView style={styles.detailsMapBg}>
                {selectedRoute.itinerary.map((place, idx) => (
                  <View
                    key={place.id}
                    style={[
                      styles.detailsMarker,
                      {
                        top: 50 + idx * 50,
                        left: 60 + idx * 60,
                      },
                    ]}
                  >
                    <SymbolView name="mappin.circle.fill" tintColor="#D36D3A" size={24} />
                    <View style={styles.detailsMarkerLabel}>
                      <ThemedText style={styles.detailsMarkerText}>{place.name}</ThemedText>
                    </View>
                  </View>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Timeline steps */}
            <ThemedView style={styles.timelineCard} type="backgroundElement">
              {selectedRoute.itinerary.map((place, idx) => (
                <View key={place.id} style={styles.timelineItem}>
                  <View style={styles.timelineMarkerCol}>
                    <View style={styles.timelineMarkerDot}>
                      <ThemedText style={styles.timelineMarkerDotText}>{idx + 1}</ThemedText>
                    </View>
                    {idx < selectedRoute.itinerary.length - 1 && (
                      <View style={styles.timelineMarkerLine} />
                    )}
                  </View>
                  <View style={styles.timelineTextCol}>
                    <ThemedText type="smallBold" style={styles.timelinePlaceName}>
                      {place.name}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      themeColor="textSecondary"
                      style={styles.timelinePlaceAddr}
                    >
                      {place.address}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </ThemedView>

            <Pressable
              onPress={() => setStep('list')}
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            >
              <ThemedText style={styles.actionBtnText}>목록으로</ThemedText>
            </Pressable>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flex: 1,
    paddingVertical: Spacing.four,
    gap: Spacing.five,
  },
  stepContainer: {
    alignSelf: 'stretch',
    gap: Spacing.four,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
    gap: Spacing.one,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  routeCard: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: Spacing.two,
  },
  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  routeNameText: {
    fontSize: 16,
    fontFamily: 'EF_jejudoldam',
    color: '#000000',
  },
  routeDates: {
    fontSize: 13,
  },
  routeDestinations: {
    fontSize: 12,
    marginTop: 2,
  },
  routeCardActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
    marginTop: Spacing.two,
  },
  cardBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBtnPrimary: {
    backgroundColor: '#D36D3A',
  },
  cardBtnTextPrimary: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardBtnSecondary: {
    backgroundColor: '#E5E5EA',
  },
  cardBtnTextSecondary: {
    color: '#000000',
    fontSize: 13,
  },
  actionBtn: {
    backgroundColor: '#D36D3A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: Spacing.four,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: Spacing.four,
  },
  cancelBtnText: {
    color: '#000000',
    fontSize: 16,
  },
  actionsRow: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  formCard: {
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: Spacing.three,
  },
  formItem: {
    gap: Spacing.one,
  },
  formLabel: {
    fontSize: 14,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  optBtn: {
    backgroundColor: '#5856D6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: Spacing.four,
    gap: Spacing.one,
  },
  optBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsMapMock: {
    height: 200,
    marginHorizontal: Spacing.four,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  detailsMapBg: {
    flex: 1,
    backgroundColor: '#E4F2FD',
    position: 'relative',
  },
  detailsMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  detailsMarkerLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: '#C7C7CC',
  },
  detailsMarkerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  timelineCard: {
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: Spacing.three,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  timelineMarkerCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineMarkerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D36D3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineMarkerDotText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineMarkerLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D36D3A',
    marginVertical: 4,
  },
  timelineTextCol: {
    flex: 1,
    gap: 2,
  },
  timelinePlaceName: {
    fontSize: 15,
    fontFamily: 'EF_jejudoldam',
    color: '#000000',
  },
  timelinePlaceAddr: {
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
