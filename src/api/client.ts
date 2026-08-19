import { useAuthStore } from '@/stores/auth-store';

export function getApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}

function getHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// ─── 오프라인 테스트용 임시 Mock 데이터 및 폴백 로직 ───
const MOCK_COURSES = [
  {
    id: 1,
    name: '혼자왓수다',
    description: '제주도에 혼자왓수다 올해도 혼자 왓수다 내년에는 둘이 왓수다',
    isPublic: true,
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    courseType: 'GENERAL',
    profiles: [],
    createdAt: '2026-07-10T00:00:00Z',
    updatedAt: '2026-07-10T00:00:00Z',
  },
  {
    id: 2,
    name: '셋이왓수다',
    description: '셋이서 떠나는 힐링 무장애(배리어프리) 여행',
    isPublic: true,
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    courseType: 'BARRIER_FREE',
    profiles: [],
    createdAt: '2026-07-10T00:00:00Z',
    updatedAt: '2026-07-10T00:00:00Z',
  },
  {
    id: 3,
    name: '댕댕이와함께',
    description: '반려동물과 함께하는 제주 애견 동반 코스',
    isPublic: true,
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    courseType: 'PET',
    profiles: [],
    createdAt: '2026-07-10T00:00:00Z',
    updatedAt: '2026-07-10T00:00:00Z',
  }
];

const MOCK_COURSE_DETAILS: Record<number, any> = {
  1: {
    courseId: 1,
    name: '혼자왓수다',
    description: '제주도에 혼자왓수다 올해도 혼자 왓수다 내년에는 둘이 왓수다',
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    courseType: 'GENERAL',
    public: true,
    dates: [
      {
        date: '2026-07-10',
        places: [
          {
            coursePlaceId: 101,
            placeId: 1001,
            order: 0,
            orderType: 'START',
            title: '제주국제공항',
            contentId: '126006',
            contentTypeId: '12',
            mapx: '126.4927',
            mapy: '33.5113',
            image: '',
          },
          {
            coursePlaceId: 102,
            placeId: 1002,
            order: 1,
            orderType: 'WAYPOINT',
            title: '함덕 해수욕장',
            contentId: '126007',
            contentTypeId: '12',
            mapx: '126.6692',
            mapy: '33.5430',
            image: '',
          },
          {
            coursePlaceId: 103,
            placeId: 1003,
            order: 2,
            orderType: 'END',
            title: '에코랜드 테마파크',
            contentId: '126008',
            contentTypeId: '12',
            mapx: '126.6685',
            mapy: '33.4560',
            image: '',
          }
        ]
      }
    ]
  },
  2: {
    courseId: 2,
    name: '셋이왓수다',
    description: '셋이서 떠나는 힐링 무장애(배리어프리) 여행',
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    courseType: 'BARRIER_FREE',
    public: true,
    dates: []
  },
  3: {
    courseId: 3,
    name: '댕댕이와함께',
    description: '반려동물과 함께하는 제주 애견 동반 코스',
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    courseType: 'PET',
    public: true,
    dates: []
  }
};

function getMockDataFallback(method: string, path: string, body?: any): any {
  console.log(`[API MOCK FALLBACK] ${method} ${path}`);
  if (path === '/courses') {
    if (method === 'GET') {
      return MOCK_COURSES;
    }
    if (method === 'PUT' && body) {
      const courseId = body.courseId || 1;
      const details = MOCK_COURSE_DETAILS[courseId] || {
        courseId,
        name: '임시 여행 코스',
        startDate: '2026-07-10',
        endDate: '2026-07-14',
        courseType: 'GENERAL',
        public: true,
      };
      return {
        ...details,
        dates: body.dates.map((d: any) => ({
          date: d.date,
          places: d.places.map((p: any, idx: number) => ({
            coursePlaceId: p.coursePlaceId || Math.floor(Math.random() * 1000) + 1000,
            placeId: p.placeId || Math.floor(Math.random() * 1000) + 1000,
            order: p.order,
            orderType: p.orderType,
            title: p.title,
            contentId: p.contentId,
            contentTypeId: p.contentTypeId,
            mapx: p.mapx,
            mapy: p.mapy,
            image: p.image,
            placeType: p.placeType,
            isPetPlace: p.isPetPlace,
            isBarrierFree: p.isBarrierFree,
          }))
        }))
      };
    }
  }
  if (path.startsWith('/courses/')) {
    const parts = path.split('/');
    const courseId = parseInt(parts[parts.length - 1], 10);
    if (method === 'GET') {
      return MOCK_COURSE_DETAILS[courseId] || {
        courseId,
        name: '임시 여행 코스',
        description: '임시 설명입니다.',
        startDate: '2026-07-10',
        endDate: '2026-07-14',
        courseType: 'GENERAL',
        public: true,
        dates: []
      };
    }
    if (method === 'DELETE') {
      return '삭제에 성공했습니다.';
    }
  }
  throw new Error(`지원하지 않는 Mock API 경로입니다: ${method} ${path}`);
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API POST] ${baseUrl}${path}`);
  if (body !== undefined) {
    console.log(`[API POST Body ${path}]:\n`, JSON.stringify(body, null, 2));
  }
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json: ApiResponse<T> = await res.json();
    console.log(`[API POST Response ${path}]:\n`, JSON.stringify(json, null, 2));
    if (!json.isSuccess) {
      throw new Error(json.message || '요청에 실패했습니다.');
    }
    return json.data;
  } catch (err) {
    console.warn(`[API POST FAIL] Falling back to mock data for ${path}:`, err);
    try {
      return getMockDataFallback('POST', path, body) as T;
    } catch {
      throw err;
    }
  }
}

export async function get<T>(path: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API GET] ${baseUrl}${path}`);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json: ApiResponse<T> = await res.json();
    console.log(`[API GET Response ${path}]:\n`, JSON.stringify(json, null, 2));
    if (!json.isSuccess) {
      throw new Error(json.message || '요청에 실패했습니다.');
    }
    return json.data;
  } catch (err) {
    console.warn(`[API GET FAIL] Falling back to mock data for ${path}:`, err);
    try {
      return getMockDataFallback('GET', path) as T;
    } catch {
      throw err;
    }
  }
}

export async function postRaw<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API POST RAW] ${baseUrl}${path}`);
  if (body !== undefined) {
    console.log(`[API POST RAW Body ${path}]:\n`, JSON.stringify(body, null, 2));
  }
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const json = await res.json();
  console.log(`[API POST RAW Response ${path}]:\n`, JSON.stringify(json, null, 2));
  if (!res.ok) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json as T;
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API PUT] ${baseUrl}${path}`);
  if (body !== undefined) {
    console.log(`[API PUT Body ${path}]:\n`, JSON.stringify(body, null, 2));
  }
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json: ApiResponse<T> = await res.json();
    console.log(`[API PUT Response ${path}]:\n`, JSON.stringify(json, null, 2));
    if (!json.isSuccess) {
      throw new Error(json.message || '요청에 실패했습니다.');
    }
    return json.data;
  } catch (err) {
    console.warn(`[API PUT FAIL] Falling back to mock data for ${path}:`, err);
    try {
      return getMockDataFallback('PUT', path, body) as T;
    } catch {
      throw err;
    }
  }
}

export async function del<T>(path: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API DELETE] ${baseUrl}${path}`);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json: ApiResponse<T> = await res.json();
    console.log(`[API DELETE Response ${path}]:\n`, JSON.stringify(json, null, 2));
    if (!json.isSuccess) {
      throw new Error(json.message || '요청에 실패했습니다.');
    }
    return json.data;
  } catch (err) {
    console.warn(`[API DELETE FAIL] Falling back to mock data for ${path}:`, err);
    try {
      return getMockDataFallback('DELETE', path) as T;
    } catch {
      throw err;
    }
  }
}

export async function patch<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API PATCH] ${baseUrl}${path}`);
  if (body !== undefined) {
    console.log(`[API PATCH Body ${path}]:\n`, JSON.stringify(body, null, 2));
  }
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json: ApiResponse<T> = await res.json();
    console.log(`[API PATCH Response ${path}]:\n`, JSON.stringify(json, null, 2));
    if (!json.isSuccess) {
      throw new Error(json.message || '요청에 실패했습니다.');
    }
    return json.data;
  } catch (err) {
    console.warn(`[API PATCH FAIL] Falling back to mock data for ${path}:`, err);
    // For profile update, return the body as a success mock
    if (path === '/users/profile') {
      return body as T;
    }
    throw err;
  }
}