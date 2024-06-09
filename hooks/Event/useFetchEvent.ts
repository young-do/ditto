import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { EventByIdType } from '@/lib/supabase/client-apis/event/type';
import { EVENT_KEY } from '@/utils/const';
import { useSupabaseClient } from '@/store/useSupabaseClient';
import { getEventById } from '@/lib/supabase/client-apis/event';

export const useFetchEventById = (eventId: number, options?: UseQueryOptions<EventByIdType, Error>) => {
  const { supabaseClient } = useSupabaseClient();

  return useQuery<EventByIdType, Error>(
    EVENT_KEY.list([{ eventId }]),
    async () => {
      const response = await getEventById(supabaseClient)(eventId);
      return response;
    },
    {
      ...options,
      staleTime: Infinity,

      onSuccess(data) {
        options?.onSuccess?.(data);
      },
    }
  );
};
