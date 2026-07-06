import { useCounterStore } from '@entities/counter/model/store';
import { Spacing } from '@shared/config/theme';
import { ThemedText } from '@shared/ui/themed-text';
import { ThemedView } from '@shared/ui/themed-view';
import { Pressable, StyleSheet } from 'react-native';

export function CounterButton() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <ThemedView style={styles.container} type="backgroundElement">
      <ThemedText type="subtitle" style={styles.title}>
        Zustand Counter: {count}
      </ThemedText>

      <ThemedView style={styles.buttonGroup}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={decrement}
          testID="decrement-btn"
        >
          <ThemedText style={styles.buttonText}>-1</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={increment}
          testID="increment-btn"
        >
          <ThemedText style={styles.buttonText}>+1</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.resetButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={reset}
          testID="reset-btn"
        >
          <ThemedText style={[styles.buttonText, styles.resetButtonText]}>Reset</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    borderRadius: 12,
    marginVertical: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    marginBottom: Spacing.one,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButtonText: {
    color: '#FF3B30',
  },
});
