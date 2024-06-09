import { Event } from '@/lib/supabase/type';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { EVENT_KEY } from '@/utils/const';
import { useUser } from '@/store/useUser';
import { useSupabaseClient } from '@/store/useSupabaseClient';
import { getEventsList } from '@/lib/supabase/client-apis/event';

export const useFetchEventList = (options?: UseQueryOptions<Event[], Error>) => {
  const { selectedGroupId } = useUser();
  const { supabaseClient } = useSupabaseClient();

  return useQuery<Event[], Error>(
    EVENT_KEY.list([{ selectedGroupId }]),
    async () => {
      const response = await getEventsList(supabaseClient)(Number(selectedGroupId));
      return response;
    },
    {
      ...options,
      enabled: !!selectedGroupId,
    }
  );
};
