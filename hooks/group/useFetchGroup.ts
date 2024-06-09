import { useSupabaseClient } from '@/store/useSupabaseClient';
import { GROUP_KEY } from '@/utils/const';
import { useQuery } from '@tanstack/react-query';
import { getGroup } from '@/lib/supabase/client-apis/group';

export const useFetchGroup = (group_id?: number | null) => {
  const { supabaseClient } = useSupabaseClient();

  return useQuery(
    GROUP_KEY.detail([group_id]),
    async () => {
      if (!group_id) throw 'need to select group';
      return await getGroup(supabaseClient)(group_id);
    },
    { enabled: !!group_id }
  );
};
