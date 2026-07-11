import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useHomeStore } from '@/stores/homeStore';
import { Spacing } from '@/styles/theme';

export function WeatherWidget() {
  const { weather, setWeather } = useHomeStore();

  const handleRefresh = () => {
    // Generate slight mock variance
    const nextTemps = [22, 23, 24, 25, 26];
    const nextConds = ['맑음', '흐림', '구름 조금', '맑음'];
    const randomTemp = nextTemps[Math.floor(Math.random() * nextTemps.length)];
    const randomCond = nextConds[Math.floor(Math.random() * nextConds.length)];

    setWeather({
      temp: randomTemp,
      condition: randomCond,
      humidity: Math.floor(Math.random() * 20) + 50,
      windSpeed: parseFloat((Math.random() * 4 + 1).toFixed(1)),
    });
  };

  return (
    <ThemedView style={styles.container} type="backgroundElement">
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleRow}>
          <SymbolView name="sun.max.fill" tintColor="#FF9500" size={20} />
          <ThemedText type="smallBold" style={styles.title}>
            실시간 제주 날씨
          </ThemedText>
        </ThemedView>
        <Pressable
          onPress={handleRefresh}
          style={({ pressed }) => [styles.refreshBtn, pressed && styles.pressed]}
        >
          <SymbolView name="arrow.clockwise" tintColor="#8E8E93" size={14} />
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.body}>
        <ThemedView style={styles.tempColumn}>
          <ThemedText style={styles.tempText}>{weather.temp}°C</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {weather.condition}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.divider} />

        <ThemedView style={styles.infoColumn}>
          <ThemedView style={styles.infoRow}>
            <ThemedText type="small" themeColor="textSecondary">
              습도
            </ThemedText>
            <ThemedText type="smallBold">{weather.humidity}%</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText type="small" themeColor="textSecondary">
              풍속
            </ThemedText>
            <ThemedText type="smallBold">{weather.windSpeed} m/s</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    borderRadius: 16,
    alignSelf: 'stretch',
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 16,
  },
  refreshBtn: {
    padding: Spacing.one,
  },
  pressed: {
    opacity: 0.6,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  tempColumn: {
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  tempText: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  infoColumn: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
    minWidth: 100,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
});
