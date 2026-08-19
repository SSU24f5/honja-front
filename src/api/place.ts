import { get, post } from '@/api/client';

// ── 공통 장소 DTO ──
export interface TourCommonResponseDto {
  contentid: string;
  contenttypeid: string;
  title: string;
  tel: string;
  addr1: string;
  addr2: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  firstimage: string;
  firstimage2: string;
  cpyrhtDivCd: string;
}

// ── 위치 기반 검색 ──
export interface UserLocationDto {
  mapx: string;
  mapy: string;
  contentTypeId: string;
}

export interface TourPlacesResponseDto {
  count: number;
  items: TourCommonResponseDto[];
}

/** POST /location/common — 위치 기반 일반 장소 조회 */
export function getLocationCommonPlaces(body: UserLocationDto) {
  return post<TourPlacesResponseDto>('/location/common', body);
}

/** POST /location/pet-friendly — 위치 기반 반려동물 장소 조회 */
export function getLocationPetPlaces(body: UserLocationDto) {
  return post<TourPlacesResponseDto>('/location/pet-friendly', body);
}

/** POST /location/barrier-free — 위치 기반 배리어프리 장소 조회 */
export function getLocationBarrierFreePlaces(body: UserLocationDto) {
  return post<TourPlacesResponseDto>('/location/barrier-free', body);
}

// ── 키워드 검색 ──

export interface SearchPlacesParams {
  keyword: string;
  pageNo?: number;
  numOfRows?: number;
}

function buildSearchQuery(params: SearchPlacesParams) {
  const q = new URLSearchParams({ keyword: params.keyword });
  if (params.pageNo) q.set('pageNo', String(params.pageNo));
  if (params.numOfRows) q.set('numOfRows', String(params.numOfRows));
  return q.toString();
}

/** GET /tour/search/general?keyword=... — 일반 장소 키워드 검색 */
export function searchGeneralPlaces(params: SearchPlacesParams) {
  return get<TourCommonResponseDto[]>(`/tour/search/general?${buildSearchQuery(params)}`);
}

/** GET /tour/search/pet?keyword=... — 반려동물 장소 키워드 검색 */
export function searchPetPlaces(params: SearchPlacesParams) {
  return get<TourCommonResponseDto[]>(`/tour/search/pet?${buildSearchQuery(params)}`);
}

/** GET /tour/search/barrier-free?keyword=... — 배리어프리 장소 키워드 검색 */
export function searchBarrierFreePlaces(params: SearchPlacesParams) {
  return get<TourCommonResponseDto[]>(`/tour/search/barrier-free?${buildSearchQuery(params)}`);
}

// ── 목록 조회 ──

/** GET /tour/pet-friendly — 반려동물 동반 가능 장소 전체 목록 */
export function getPetPlaces() {
  return get<TourCommonResponseDto[]>('/tour/pet-friendly');
}

/** GET /tour/barrier-free — 배리어프리 장소 전체 목록 */
export function getBarrierFreePlaces() {
  return get<TourCommonResponseDto[]>('/tour/barrier-free');
}

// ── 상세 조회 ──

export interface PetDetailResponseDto {
  acmpyNeedMtr: string;      // 동반 필요사항
  contentid: string;
  relaAcdntRiskMtr: string;  // 사고 위협 사항
  acmpyTypeCd: string;       // 동반 유형 코드
  relaPosesFclty: string;    // 보유 시설
  relaFrnshPrdlst: string;   // 제공 물품
  etcAcmpyInfo: string;      // 기타 동반 정보
  relaPurcPrdlst: string;    // 구매 가능 물품
  acmpyPsblCpam: string;     // 동반 가능 동물 종류
  relaRntlPrdlst: string;    // 대여 가능 물품
}

interface PetDetailResponse {
  response: {
    body: {
      items: { item: PetDetailResponseDto[] };
    };
  };
}

/** GET /tour/pet-friendly/{contentId} — 반려동물 장소 상세 정보 */
export async function getPetPlaceDetail(contentId: string | number) {
  const data = await get<PetDetailResponse>(`/tour/pet-friendly/${contentId}`);
  return data?.response?.body?.items?.item ?? [];
}

export interface DetailAccessibilityDto {
  contentid: string;
  wheelchair: string;
  exit: string;
  elevator: string;
  restroom: string;
  parking: string;
  route: string;
  ticketoffice: string;
  braileblock: string;
  helpdog: string;
  guidehuman: string;
  audioguide: string;
  bigprint: string;
  brailepromotion: string;
  guidesystem: string;
  blindhandicapetc: string;
  signguide: string;
  videoguide: string;
  hearingroom: string;
  hearinghandicapetc: string;
  stroller: string;
  lactationroom: string;
  babysparechair: string;
  infantsfamilyetc: string;
  auditorium: string;
  room: string;
  handicapetc: string;
  publictransport: string;
  promotion: string;
}

interface BarrierFreeDetailResponse {
  response: {
    body: {
      items: { item: DetailAccessibilityDto[] };
    };
  };
}

/** GET /tour/barrier-free/{contentId} — 배리어프리 장소 상세 정보 */
export async function getBarrierFreePlaceDetail(contentId: string | number) {
  const data = await get<BarrierFreeDetailResponse>(`/tour/barrier-free/${contentId}`);
  return data?.response?.body?.items?.item ?? [];
}
