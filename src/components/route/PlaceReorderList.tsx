import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useRouteStore } from '@/stores/routeStore';
import { Spacing } from '@/styles/theme';

export function PlaceReorderList() {
  const { itinerary, movePlaceUp, movePlaceDown } = useRouteStore();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <SymbolView name="arrow.up.and.down.text.horizontal" tintColor="#5856D6" size={20} />
        <ThemedText type="smallBold" style={styles.title}>
          방문 순서 변경
        </ThemedText>
      </ThemedView>

      {itinerary.length < 2 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="small" themeColor="textSecondary">
            순서를 변경할 장소가 부족합니다 (최소 2개).
          </ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.list}>
          {itinerary.map((place, idx) => (
            <ThemedView key={place.id} style={styles.card}>
              <ThemedView style={styles.placeInfo}>
                <ThemedText type="smallBold" style={styles.orderNum}>
                  {idx + 1}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.placeName}>
                  {place.name}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.controls}>
                <Pressable
                  disabled={idx === 0}
                  onPress={() => movePlaceUp(idx)}
                  style={({ pressed }) => [
                    styles.arrowBtn,
                    idx === 0 && styles.disabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <SymbolView
                    name="chevron.up"
                    tintColor={idx === 0 ? '#C7C7CC' : '#5856D6'}
                    size={18}
                  />
                </Pressable>

                <Pressable
                  disabled={idx === itinerary.length - 1}
                  onPress={() => movePlaceDown(idx)}
                  style={({ pressed }) => [
                    styles.arrowBtn,
                    idx === itinerary.length - 1 && styles.disabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <SymbolView
                    name="chevron.down"
                    tintColor={idx === itinerary.length - 1 ? '#C7C7CC' : '#5856D6'}
                    size={18}
                  />
                </Pressable>
              </ThemedView>
            </ThemedView>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.four,
  },
  title: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: Spacing.five,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginHorizontal: Spacing.four,
  },
  list: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: Spacing.three,
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  orderNum: {
    color: '#5856D6',
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  placeName: {
    fontSize: 14,
    fontFamily: 'EF_jejudoldam',
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  arrowBtn: {
    padding: Spacing.one,
    borderRadius: 6,
    backgroundColor: '#F2F2F7',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.6,
  },
});
