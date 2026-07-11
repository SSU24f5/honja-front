import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { type OlleTrail, useHomeStore } from '@/stores/homeStore';
import { Spacing } from '@/styles/theme';

export function OlleTrailList() {
  const { trails, toggleTrailCompleted } = useHomeStore();

  const getDifficultyColor = (diff: OlleTrail['difficulty']) => {
    switch (diff) {
      case '상':
        return '#FF3B30';
      case '중':
        return '#FF9500';
      case '하':
        return '#34C759';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <SymbolView name="shoeprints.fill" tintColor="#007AFF" size={20} />
        <ThemedText type="smallBold" style={styles.title}>
          제주 올레길 코스 추천
        </ThemedText>
      </ThemedView>

      <View style={styles.list}>
        {trails.map((trail) => (
          <Pressable
            key={trail.id}
            onPress={() => toggleTrailCompleted(trail.id)}
            style={({ pressed }) => [
              styles.card,
              trail.completed && styles.cardCompleted,
              pressed && styles.pressed,
            ]}
          >
            <ThemedView style={styles.cardHeader}>
              <ThemedView style={styles.badgeRow}>
                <ThemedText type="code" style={styles.courseNum}>
                  코스 {trail.courseNumber}
                </ThemedText>
                <ThemedView
                  style={[
                    styles.diffBadge,
                    { backgroundColor: getDifficultyColor(trail.difficulty) },
                  ]}
                >
                  <ThemedText style={styles.diffText}>{trail.difficulty}</ThemedText>
                </ThemedView>
              </ThemedView>
              {trail.completed && (
                <SymbolView name="checkmark.circle.fill" tintColor="#34C759" size={18} />
              )}
            </ThemedView>

            <ThemedText type="smallBold" style={styles.trailName}>
              {trail.name}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.desc}>
              {trail.description}
            </ThemedText>

            <ThemedText type="code" themeColor="textSecondary" style={styles.distance}>
              거리: {trail.distance}
            </ThemedText>
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
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 16,
  },
  list: {
    gap: Spacing.three,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardCompleted: {
    borderColor: '#34C759',
    backgroundColor: '#F2FBF4',
  },
  pressed: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  courseNum: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trailName: {
    fontSize: 15,
  },
  desc: {
    fontSize: 13,
  },
  distance: {
    fontSize: 11,
    marginTop: Spacing.one,
  },
});
