import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Spacing } from '@/styles/theme';
import { getCurrentWeather, weatherTypeToAsset, WeatherOnlyResDTO } from '@/api/weather';

import SunnyIcon from '@/assets/icon/weather/sunny.svg';
import CloudyIcon from '@/assets/icon/weather/cloudy.svg';
import RainyIcon from '@/assets/icon/weather/rainy.svg';
import OvercastIcon from '@/assets/icon/weather/overcast.svg';
import SnowIcon from '@/assets/icon/weather/snow.svg';
import ThunderIcon from '@/assets/icon/weather/thunder.svg';

// 제주도 안덕면 좌표 (기본값)
const JEJU_LAT = 33.3638;
const JEJU_LON = 126.3196;
const ICON_SIZE = 28;

function WeatherIcon({ type }: { type: ReturnType<typeof weatherTypeToAsset> }) {
  switch (type) {
    case 'sunny':   return <SunnyIcon width={ICON_SIZE} height={ICON_SIZE} />;
    case 'cloudy':  return <CloudyIcon width={ICON_SIZE} height={ICON_SIZE} />;
    case 'rainy':   return <RainyIcon width={ICON_SIZE} height={ICON_SIZE} />;
    case 'overcast':return <OvercastIcon width={ICON_SIZE} height={ICON_SIZE} />;
    case 'snow':    return <SnowIcon width={ICON_SIZE} height={ICON_SIZE} />;
    case 'thunder': return <ThunderIcon width={ICON_SIZE} height={ICON_SIZE} />;
    default:        return <SunnyIcon width={ICON_SIZE} height={ICON_SIZE} />;
  }
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherOnlyResDTO | null>(null);

  useEffect(() => {
    getCurrentWeather(JEJU_LAT, JEJU_LON)
      .then(setWeather)
      .catch(() => {
        // 오프라인 fallback — 목업 데이터
        setWeather({
          region: '제주특별자치도 안덕면',
          weatherType: 'SUNNY',
          temperature: 28,
          dustGrade: '보통',
          pm10Value: 40,
          pm25Value: 15,
          recommendation: 'OUTDOOR',
          weatherDataReliable: false,
        });
      });
  }, []);

  // 날씨 데이터가 없을 때는 스켈레톤 자리
  const iconType = weather ? weatherTypeToAsset(weather.weatherType) : 'sunny';
  const tempText = weather ? `${Math.round(weather.temperature)}°` : '--°';
  const region = weather?.region ?? '제주특별자치도 안덕면';

  // 시간별 더미 슬롯 (실제 예보 API 없이 현재 날씨 반복 표시)
  const hours = ['11시', '12시', '13시', '14시', '15시', '16시'];

  return (
    <View style={styles.container}>
      {/* 상단: 위치 + 기온 */}
      <View style={styles.headerRow}>
        <View style={styles.locationContainer}>
          <Text style={styles.pinIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>{region}</Text>
        </View>
        <View style={styles.tempRangeContainer}>
          <Text style={styles.tempText}>{tempText}</Text>
          {weather && (
            <Text style={styles.dustText}> 미세먼지 {weather.dustGrade}</Text>
          )}
        </View>
      </View>

      {/* 시간별 날씨 가로 슬라이더 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hourlyContainer}
      >
        {hours.map((hour, idx) => (
          <View key={idx} style={styles.hourCell}>
            <Text style={styles.hourText}>{hour}</Text>
            <View style={styles.iconWrapper}>
              <WeatherIcon type={iconType} />
            </View>
            <Text style={styles.hourTempText}>{tempText}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
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
    flex: 1,
  },
  pinIcon: { fontSize: 16 },
  locationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flexShrink: 1,
  },
  tempRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E06635',
  },
  dustText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
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
