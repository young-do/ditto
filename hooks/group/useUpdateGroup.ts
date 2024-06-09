import { useSupabaseClient } from '@/store/useSupabaseClient';
import { GROUP_KEY } from '@/utils/const';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGroup } from '@/lib/supabase/client-apis/group';

export type UpdateGroupParams = {
  groupId: number;
  groupName?: string;
  isOpenedEvents?: boolean;
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useSupabaseClient();

  return useMutation(
    async ({ groupId, groupName, isOpenedEvents }: UpdateGroupParams) => {
      const group = await updateGroup(supabaseClient)(groupId, { name: groupName, is_opened_events: isOpenedEvents });
      return group;
    },
    {
      onSuccess: (group) => {
        queryClient.setQueryData(GROUP_KEY.detail([group.id]), group);
      },
    }
  );
};
