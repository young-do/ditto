import { deleteEvent } from '@/lib/supabase/apis/event';
import { EVENT_KEY } from '@/utils/const';
import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query';

export const useDeleteEvent = (options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation(async (eventId: number) => await deleteEvent(eventId), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEY.lists() });
      options?.onSuccess?.(data, variables, context);
      // TODO: 삭제 완료 토스트 띄우기
    },
    onError: () => {
      // TODO: 삭제 에러 토스트 띄우기
    },
  });
};