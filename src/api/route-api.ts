import { get } from '@/api/client';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Guide extends LatLng {
  guidance: string;
  distance: number;
  duration: number;
}

export interface Bound {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export interface RouteResponseDto {
  originPlaceId: number;
  destinationPlaceId: number;
  distance: number;
  duration: number;
  bound: Bound;
  path: LatLng[];
  guides: Guide[];
}

/**
 * GET /courses/{courseId}/route
 * 두 장소 간 경로 정보 조회
 */
export function getRoute(
  courseId: number,
  originPlaceId: number,
  destinationPlaceId: number,
  priority: string = 'RECOMMEND',
) {
  const params = new URLSearchParams({
    originPlaceId: String(originPlaceId),
    destinationPlaceId: String(destinationPlaceId),
    priority,
  });
  return get<RouteResponseDto>(`/courses/${courseId}/route?${params}`);
}
