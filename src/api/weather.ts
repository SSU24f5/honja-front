import { get } from '@/api/client';

export type WeatherType = 'SUNNY' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'RAIN' | 'RAIN_SNOW' | 'SNOW' | 'SHOWER';
export type WeatherRecommendation = 'OUTDOOR' | 'INDOOR';

export interface WeatherOnlyResDTO {
  region: string;
  weatherType: WeatherType;
  temperature: number;
  dustGrade: string;
  pm10Value: number;
  pm25Value: number;
  recommendation: WeatherRecommendation;
  weatherDataReliable: boolean;
}

export interface PlaceSummary {
  contentId: string;
  title: string;
  image: string;
  mapx: number;
  mapy: number;
  petPlace: boolean;
  barrierFree: boolean;
}

export interface WeatherResDTO extends WeatherOnlyResDTO {
  places: PlaceSummary[];
}

/** GET /api/weather/current — 현재 날씨만 조회 */
export function getCurrentWeather(lat: number, lon: number) {
  return get<WeatherOnlyResDTO>(`/api/weather/current?lat=${lat}&lon=${lon}`);
}

/** GET /api/weather/recommendation — 날씨 + 추천 장소 조회 */
export function getWeatherRecommendation(lat: number, lon: number) {
  return get<WeatherResDTO>(`/api/weather/recommendation?lat=${lat}&lon=${lon}`);
}

/** 날씨 타입을 실제 SVG 에셋 파일명으로 매핑 */
export function weatherTypeToAsset(type: WeatherType): 'sunny' | 'cloudy' | 'rainy' | 'overcast' | 'snow' | 'thunder' {
  switch (type) {
    case 'SUNNY': return 'sunny';
    case 'PARTLY_CLOUDY': return 'cloudy';
    case 'CLOUDY': return 'overcast';
    case 'RAIN':
    case 'RAIN_SNOW':
    case 'SHOWER': return 'rainy';
    case 'SNOW': return 'snow';
    default: return 'sunny';
  }
}
