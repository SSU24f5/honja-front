import { get, put } from '@/api/client';
import type { CourseType } from '@/api/dto/client';

export interface CourseListResponseDto {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  startDate: string; // e.g. "2026-08-08"
  endDate: string; // e.g. "2026-08-11"
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

export function getCourses() {
  return get<CourseListResponseDto[]>('/courses');
}

export function getCourseDetail(courseId: number) {
  return get<CourseDetailResponseDto>(`/courses/${courseId}`);
}

export function updateCoursePlaces(body: UpdateCourseRequestDto) {
  return put<CourseDetailResponseDto>('/courses', body);
}
