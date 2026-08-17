import type { CourseType } from '@/api/dto/client';

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  GENERAL: '일반',
  BARRIER_FREE: '배리어프리',
  PET: '반려동물과 함께',
};

export function getCourseTypeLabel(courseType: CourseType | string): string {
  return COURSE_TYPE_LABELS[courseType as CourseType] ?? '일반';
}

export function formatDateRangeWithDuration(startDate: string, endDate: string): string {
  const format = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${y.slice(2)}/${m}/${d}`;
  };

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return `${format(startDate)} ~ ${format(endDate)} (${diffDays}박 ${diffDays + 1}일)`;
}

export function formatShortDate(isoDateString: string): string {
  const d = new Date(isoDateString);
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}