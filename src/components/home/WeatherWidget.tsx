import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Spacing } from '@/styles/theme';

// Import SVG weather icons from assets/icon/weather
import SunnyIcon from '@/assets/icon/weather/sunny.svg';
import CloudyIcon from '@/assets/icon/weather/cloudy.svg';
import RainyIcon from '@/assets/icon/weather/rainy.svg';

const ICON_SIZE = 28;

export function WeatherWidget() {
  // Mock hourly data mapped to matching SVG component imports
  const hourlyData = [
    { hour: '11시', temp: '28°', iconComponent: <SunnyIcon width={ICON_SIZE} height={ICON_SIZE} /> },
    { hour: '12시', temp: '28°', iconComponent: <SunnyIcon width={ICON_SIZE} height={ICON_SIZE} /> },
    { hour: '13시', temp: '28°', iconComponent: <SunnyIcon width={ICON_SIZE} height={ICON_SIZE} /> },
    { hour: '14시', temp: '28°', iconComponent: <CloudyIcon width={ICON_SIZE} height={ICON_SIZE} /> },
    { hour: '15시', temp: '28°', iconComponent: <RainyIcon width={ICON_SIZE} height={ICON_SIZE} /> },
    { hour: '16시', temp: '28°', iconComponent: <RainyIcon width={ICON_SIZE} height={ICON_SIZE} /> },
  ];

  return (
    <View style={styles.container}>
      {/* Top row: Location & Temperature Range */}
      <View style={styles.headerRow}>
        <View style={styles.locationContainer}>
          <Text style={styles.pinIcon}>📍</Text>
          <Text style={styles.locationText}>제주특별자치도 안덕면</Text>
        </View>
        <View style={styles.tempRangeContainer}>
          <Text style={styles.lowTemp}>26°</Text>
          <Text style={styles.tempDivider}> / </Text>
          <Text style={styles.highTemp}>30°</Text>
        </View>
      </View>

      {/* Hourly weather row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hourlyContainer}
      >
        {hourlyData.map((item, idx) => (
          <View key={idx} style={styles.hourCell}>
            <Text style={styles.hourText}>{item.hour}</Text>
            
            {/* Render actual weather SVG icons */}
            <View style={styles.iconWrapper}>
              {item.iconComponent}
            </View>

            <Text style={styles.hourTempText}>{item.temp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0, // Expanded to container edges
    padding: Spacing.four,
    borderRadius: 20,
    backgroundColor: '#FAF8F6',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pinIcon: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  tempRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lowTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  tempDivider: {
    fontSize: 16,
    color: '#8E8E93',
  },
  highTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  hourlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    width: '100%',
  },
  hourCell: {
    alignItems: 'center',
    width: 52,
    gap: 8,
  },
  hourText: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourTempText: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '600',
  },
});
