import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCourse, getCourses } from '@/api/course';

export const MY_COURSES_QUERY_KEY = ['courses', 'my'] as const;

export function useMyCourses() {
  return useQuery({
    queryKey: MY_COURSES_QUERY_KEY,
    queryFn: getCourses,
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_COURSES_QUERY_KEY });
    },
  });
}