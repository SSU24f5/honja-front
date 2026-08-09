const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export type CourseType = 'BARRIER_FREE' | 'PET' | 'GENERAL';
export type TripCategory = 'ALONE' | 'FAMILY' | 'FRIEND' | 'LOVER' | 'ETC';

export interface CreateCourseRequest {
  name: string;
  description: string;
  isPublic: boolean;
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
  courseType: CourseType;
  tripCategory: TripCategory;
}

export interface CreateCourseResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    courseType: CourseType;
    createdAt: string;
    updatedAt: string;
    public: boolean;
  };
}

export async function createCourse(body: CreateCourseRequest): Promise<CreateCourseResponse> {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`POST /course 실패 (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ── 장소 검색 API ──

export interface PlaceSearchItem {
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

export interface SearchPlacesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: PlaceSearchItem[];
}

const COURSE_TYPE_SEARCH_PATH: Record<CourseType, string> = {
  GENERAL: '/tour/search/general',
  PET: '/tour/search/pet',
  BARRIER_FREE: '/tour/search/barrier-free',
};

export async function searchPlaces(
  keyword: string,
  courseType: CourseType,
): Promise<SearchPlacesResponse> {
  const path = COURSE_TYPE_SEARCH_PATH[courseType];
  const params = new URLSearchParams({
    keyword,
    pageNo: '1',
    numOfRows: '10',
  });

  const requestUrl = `${BASE_URL}${path}?${params}`;
  console.log(`[API Client] Fetching: ${requestUrl}`);
  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`GET ${path} 실패 (${response.status}): ${errorText}`);
  }

  return response.json();
}
