import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useMapStore } from '@/stores/mapStore';
import { Spacing } from '@/styles/theme';

export function FilterPanel() {
  const { filters, toggleFilter } = useMapStore();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          onPress={() => toggleFilter('barrierFree')}
          style={({ pressed }) => [
            styles.chip,
            filters.barrierFree && styles.chipActive,
            pressed && styles.pressed,
          ]}
        >
          <SymbolView
            name="figure.roll"
            tintColor={filters.barrierFree ? '#FFFFFF' : '#8E8E93'}
            size={14}
          />
          <ThemedText style={[styles.chipText, filters.barrierFree && styles.chipTextActive]}>
            배리어 프리
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => toggleFilter('petFriendly')}
          style={({ pressed }) => [
            styles.chip,
            filters.petFriendly && styles.chipActive,
            pressed && styles.pressed,
          ]}
        >
          <SymbolView
            name="dog.fill"
            tintColor={filters.petFriendly ? '#FFFFFF' : '#8E8E93'}
            size={14}
          />
          <ThemedText style={[styles.chipText, filters.petFriendly && styles.chipTextActive]}>
            반려동물 동반
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => toggleFilter('parking')}
          style={({ pressed }) => [
            styles.chip,
            filters.parking && styles.chipActive,
            pressed && styles.pressed,
          ]}
        >
          <SymbolView
            name="car.fill"
            tintColor={filters.parking ? '#FFFFFF' : '#8E8E93'}
            size={14}
          />
          <ThemedText style={[styles.chipText, filters.parking && styles.chipTextActive]}>
            주차 편리
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    gap: 6,
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },
});
