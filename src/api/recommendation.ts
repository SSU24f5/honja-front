import { post, postRaw } from '@/api/client';

export interface RecommendedPlaceDto {
  contentid: string;
  contenttypeid?: string;
  title: string;
  tel?: string;
  addr1?: string;
  addr2?: string;
  mapx?: string;
  mapy?: string;
  mlevel?: string;
  firstimage?: string;
  firstimage2?: string;
  cpyrhtDivCd?: string;
}

export interface BetweenRecommendationRequestDto {
  startCoursePlaceId: number;
  endCoursePlaceId: number;
}

export function getBetweenRecommendation(
  courseType: string,
  body: BetweenRecommendationRequestDto,
): Promise<RecommendedPlaceDto[]> {
  let endpoint = '/recommendation/between/general';
  const typeUpper = (courseType || 'GENERAL').toUpperCase();

  if (typeUpper === 'BARRIER_FREE' || typeUpper === 'BARRIER-FREE' || typeUpper === '배리어프리') {
    endpoint = '/recommendation/between/barrier-free';
  } else if (
    typeUpper === 'PET' ||
    typeUpper === 'PET_FRIENDLY' ||
    typeUpper === 'PET-FRIENDLY' ||
    typeUpper === '반려동물'
  ) {
    endpoint = '/recommendation/between/pet-friendly';
  }

  return post<RecommendedPlaceDto[]>(endpoint, body);
}

export interface RouteRecommendationPlace {
  coursePlaceId: number;
  placeId: number;
  order: number;
  orderType: 'START' | 'WAYPOINT' | 'END' | string;
  title?: string;
  distance: string;
  timeTaken: string;
  contentId?: string;
  mapx?: number;
  mapy?: number;
  petPlace?: boolean;
  barrierFree?: boolean;
}

export interface RouteRecommendationResponse {
  courseId: number;
  date: string;
  places: RouteRecommendationPlace[];
}

export interface RouteRecommendationRequestDto {
  courseId: number;
  date: string;
}

export function getRouteRecommendation(
  body: RouteRecommendationRequestDto,
): Promise<RouteRecommendationResponse> {
  return postRaw<RouteRecommendationResponse>('/recommendation/course-order', body);
}
