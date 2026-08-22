import { getApiBaseUrl } from '@/api/client';

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
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/courses`, {
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
  } catch (err) {
    console.warn('[API createCourse FAIL] Falling back to mock success:', err);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '성공',
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        name: body.name,
        description: body.description,
        startDate: body.startDate,
        endDate: body.endDate,
        courseType: body.courseType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        public: body.isPublic,
      }
    };
  }
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

// ─── 오프라인용 관광지 목업 데이터 ───
const MOCK_SEARCH_PLACES = [
  {
    contentid: '126006',
    contenttypeid: '12',
    title: '제주국제공항',
    tel: '064-797-2114',
    addr1: '제주특별자치도 제주시 공항로 2',
    addr2: '',
    mapx: '126.4927',
    mapy: '33.5113',
    mlevel: '6',
    firstimage: '',
    firstimage2: '',
    cpyrhtDivCd: '',
  },
  {
    contentid: '126007',
    contenttypeid: '12',
    title: '함덕 해수욕장',
    tel: '064-728-3989',
    addr1: '제주특별자치도 제주시 조천읍 함덕리 1008',
    addr2: '',
    mapx: '126.6692',
    mapy: '33.5430',
    mlevel: '6',
    firstimage: '',
    firstimage2: '',
    cpyrhtDivCd: '',
  },
  {
    contentid: '126008',
    contenttypeid: '12',
    title: '에코랜드 테마파크',
    tel: '064-802-8020',
    addr1: '제주특별자치도 제주시 조천읍 번영로 1278-169',
    addr2: '',
    mapx: '126.6685',
    mapy: '33.4560',
    mlevel: '6',
    firstimage: '',
    firstimage2: '',
    cpyrhtDivCd: '',
  },
  {
    contentid: '126009',
    contenttypeid: '12',
    title: '오설록 티 뮤지엄',
    tel: '064-794-5312',
    addr1: '제주특별자치도 서귀포시 안덕면 신화역사로 15',
    addr2: '',
    mapx: '126.3283',
    mapy: '33.3060',
    mlevel: '6',
    firstimage: '',
    firstimage2: '',
    cpyrhtDivCd: '',
  },
  {
    contentid: '126010',
    contenttypeid: '12',
    title: '성산 일출봉',
    tel: '064-783-0959',
    addr1: '제주특별자치도 서귀포시 성산읍 일출로 284-12',
    addr2: '',
    mapx: '126.9372',
    mapy: '33.4583',
    mlevel: '6',
    firstimage: '',
    firstimage2: '',
    cpyrhtDivCd: '',
  },
  {
    contentid: '126011',
    contenttypeid: '12',
    title: '곽지 해수욕장',
    tel: '064-728-3985',
    addr1: '제주특별자치도 제주시 애월읍 곽지리',
    addr2: '',
    mapx: '126.3039',
    mapy: '33.4514',
    mlevel: '6',
    firstimage: '',
    firstimage2: '',
    cpyrhtDivCd: '',
  }
];

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

  const baseUrl = getApiBaseUrl();
  const requestUrl = `${baseUrl}${path}?${params}`;
  console.log(`[API Client] Fetching: ${requestUrl}`);
  try {
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
  } catch (err) {
    console.warn(`[API searchPlaces FAIL] Falling back to mock results for "${keyword}":`, err);
    const filtered = MOCK_SEARCH_PLACES.filter(p => 
      p.title.includes(keyword) || p.addr1.includes(keyword)
    );
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '성공',
      data: filtered.length > 0 ? filtered : MOCK_SEARCH_PLACES,
    };
  }
}
