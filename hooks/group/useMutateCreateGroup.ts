import { useSupabaseClient } from '@/store/useSupabaseClient';
import { GROUP_KEY } from '@/utils/const';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup, joinGroup, createDefaultBucketFolder } from '@/lib/supabase/client-apis/group';

export type CreateGroupParams = {
  userId: number;
  groupName: string;
};

export const useMutateCreateGroup = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useSupabaseClient();

  return useMutation(
    async ({ userId, groupName }: CreateGroupParams) => {
      const group = await createGroup(supabaseClient)(userId, groupName);
      await joinGroup(supabaseClient)(userId, group.id);
      await createDefaultBucketFolder(supabaseClient)(userId, group.id);
      return group;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: GROUP_KEY.all });
      },
    }
  );
};
