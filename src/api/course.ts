import { get, post, put, del } from '@/api/client';
import type { CourseType } from '@/api/dto/client';

// ── DTOs ──

export interface CourseListResponseDto {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  startDate: string;
  endDate: string;
  courseType: CourseType | string;
  profiles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CoursePlaceDetailDto {
  coursePlaceId: number;
  placeId: number;
  order: number;
  orderType: 'START' | 'WAYPOINT' | 'END' | string;
  title: string;
  contentId: string;
  contentTypeId: string;
  cat3?: string;
  image?: string;
  isPetPlace?: boolean;
  isBarrierFree?: boolean;
  mapx?: string;
  mapy?: string;
  placeType?: string;
  newItem?: boolean;
}

export interface CourseDateDetailDto {
  date: string;
  places: CoursePlaceDetailDto[];
}

export interface CourseDetailResponseDto {
  courseId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  courseType: CourseType | string;
  dates: CourseDateDetailDto[];
  public: boolean;
}

export interface UpdateCoursePlaceItemDto {
  coursePlaceId?: number;
  placeId?: number;
  order: number;
  orderType?: 'START' | 'WAYPOINT' | 'END' | string;
  title?: string;
  contentId?: string;
  contentTypeId?: string;
  cat3?: string;
  image?: string;
  isPetPlace?: boolean;
  isBarrierFree?: boolean;
  mapx?: string;
  mapy?: string;
  placeType: string;
}

export interface UpdateCourseDateItemDto {
  date: string; // YYYY-MM-DD
  places: UpdateCoursePlaceItemDto[];
}

export interface UpdateCourseRequestDto {
  courseId: number;
  dates: UpdateCourseDateItemDto[];
}

export type UpdateCourseResponseDto = CourseDetailResponseDto;

export interface CreateCourseRequestDto {
  name: string;
  description?: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  courseType: CourseType | string;
  isPublic?: boolean;
}

export interface PublicCourseListResponseDto extends CourseListResponseDto {
  ownerNickname?: string;
}

// ── API 함수 ──

/** GET /courses — 내 코스 목록 조회 */
export function getCourses() {
  return get<CourseListResponseDto[]>('/courses');
}

/** POST /courses — 새 코스 생성 */
export function createCourse(body: CreateCourseRequestDto) {
  return post<CourseDetailResponseDto>('/courses', body);
}

/** GET /courses/{courseId} — 코스 상세 조회 */
export function getCourseDetail(courseId: number) {
  return get<CourseDetailResponseDto>(`/courses/${courseId}`);
}

/** PUT /courses — 코스 장소 업데이트 */
export function updateCoursePlaces(body: UpdateCourseRequestDto) {
  return put<CourseDetailResponseDto>('/courses', body);
}

/** DELETE /courses/{courseId} — 코스 삭제 */
export function deleteCourse(courseId: number): Promise<string> {
  return del<string>(`/courses/${courseId}`);
}

/** GET /courses/public — 공개 코스 목록 조회 (탐색용) */
export function getPublicCourses() {
  return get<PublicCourseListResponseDto[]>('/courses/public');
}