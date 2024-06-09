import { User } from '@/lib/supabase/type';
import { useSupabaseClient } from '@/store/useSupabaseClient';
import { GROUP_KEY } from '@/utils/const';
import { useQuery } from '@tanstack/react-query';
import { getJoinedGroupList } from '@/lib/supabase/client-apis/group';

export const useFetchJoinedGroupList = (user?: User | null) => {
  const { supabaseClient } = useSupabaseClient();

  return useQuery(
    GROUP_KEY.list([user]),
    async () => {
      if (!user) throw 'need to login';
      return await getJoinedGroupList(supabaseClient)(user.id);
    },
    { enabled: !!user }
  );
};
