import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useMyPageStore } from '@/stores/mypageStore';
import { Spacing } from '@/styles/theme';

export function StampGrid() {
  const { stamps, toggleStamp } = useMyPageStore();

  // biome-ignore lint/suspicious/noExplicitAny: Bypassing strict SF symbol catalog type checking
  const getStampIcon = (id: string): any => {
    switch (id) {
      case 'stamp-1':
        return 'mountain.fill';
      case 'stamp-2':
        return 'sunset.fill';
      case 'stamp-3':
        return 'bicycle';
      case 'stamp-4':
        return 'sun.max.fill';
      case 'stamp-5':
        return 'camera.fill';
      case 'stamp-6':
        return 'drop.fill';
      default:
        return 'checkmark.seal.fill';
    }
  };

  const getStampColor = (id: string) => {
    switch (id) {
      case 'stamp-1':
        return '#34C759'; // Mountain green
      case 'stamp-2':
        return '#FF9500'; // Sun orange
      case 'stamp-3':
        return '#007AFF'; // Bicycle blue
      case 'stamp-4':
        return '#FF2D55'; // Sunset red/pink
      case 'stamp-5':
        return '#FFCC00'; // Camera/Flower yellow
      case 'stamp-6':
        return '#5856D6'; // Falls indigo
      default:
        return '#AF52DE';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <SymbolView name="checkmark.seal.fill" tintColor="#D36D3A" size={20} />
        <ThemedText type="smallBold" style={styles.title}>
          제주 여행 스탬프 북
        </ThemedText>
      </ThemedView>

      <View style={styles.grid}>
        {stamps.map((stamp) => (
          <Pressable
            key={stamp.id}
            onPress={() => toggleStamp(stamp.id)}
            style={({ pressed }) => [
              styles.stampCell,
              stamp.earned && styles.stampCellEarned,
              pressed && styles.pressed,
            ]}
          >
            <ThemedView
              style={[
                styles.iconContainer,
                { backgroundColor: stamp.earned ? getStampColor(stamp.id) : '#E5E5EA' },
              ]}
            >
              <SymbolView
                name={getStampIcon(stamp.id)}
                tintColor={stamp.earned ? '#FFFFFF' : '#8E8E93'}
                size={22}
              />
            </ThemedView>
            <ThemedText type="smallBold" style={styles.stampName}>
              {stamp.name}
            </ThemedText>
            {stamp.earned ? (
              <ThemedText type="code" style={styles.dateText}>
                {stamp.earnedAt}
              </ThemedText>
            ) : (
              <ThemedText type="code" themeColor="textSecondary" style={styles.dateText}>
                미획득
              </ThemedText>
            )}
          </Pressable>
        ))}
      </View>
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
    paddingHorizontal: Spacing.one,
  },
  title: {
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  stampCell: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
  },
  stampCellEarned: {
    borderColor: '#D36D3A',
    shadowColor: '#D36D3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stampName: {
    fontSize: 13,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 10,
    marginTop: 2,
  },
});
