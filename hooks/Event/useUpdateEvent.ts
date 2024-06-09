import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { UpdateEventType } from '@/lib/supabase/client-apis/event/type';
import { EVENT_KEY } from '@/utils/const';
import useCustomToast from '../shared/useCustomToast';
import { useSupabaseClient } from '@/store/useSupabaseClient';
import { updateEvent } from '@/lib/supabase/client-apis/event';

export const useUpdateEvent = (options?: Omit<UseMutationOptions<void, Error, UpdateEventType>, 'mutationFn'>) => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useSupabaseClient();
  const { openToast } = useCustomToast();

  return useMutation(async (params: UpdateEventType) => await updateEvent(supabaseClient)(params), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEY.lists() });
      options?.onSuccess?.(data, variables, context);
      openToast({ message: '일정이 편집되었습니다.', type: 'success' });
    },
    onError: () => {
      openToast({ message: '일정 편집에 실패했습니다. 화면을 새로고침해주세요.', type: 'error' });
    },
  });
};
