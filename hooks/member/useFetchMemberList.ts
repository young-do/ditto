import { useSupabaseClient } from '@/store/useSupabaseClient';
import { MEMBER_KEY } from '@/utils/const';
import { useQuery } from '@tanstack/react-query';
import { getMemberListByGroupId } from '@/lib/supabase/client-apis/member';

export const useFetchMemberList = (group_id?: number | null) => {
  const { supabaseClient } = useSupabaseClient();

  return useQuery(
    MEMBER_KEY.list([group_id]),
    async () => {
      if (!group_id) throw 'need to select group';
      return await getMemberListByGroupId(supabaseClient)(group_id);
    },
    { enabled: !!group_id }
  );
};
