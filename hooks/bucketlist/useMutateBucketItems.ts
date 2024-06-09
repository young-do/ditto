/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { useUser } from '@/store/useUser';
import { TCreateBucketItem, TUpdateBucketItem } from '@/lib/supabase/client-apis/bucketlist/type';
import { BUCKET_ITEM_KEY } from '@/utils/const';
import useCustomToast from '@/hooks/shared/useCustomToast';
import { useSupabaseClient } from '@/store/useSupabaseClient';
import {
  createBucketItem,
  updateBucketItem,
  deleteBucketItem,
  completeBucketItem,
} from '@/lib/supabase/client-apis/bucketlist';

export const useMutateBucketItems = () => {
  const queryClient = useQueryClient();
  const { selectedGroupId, user } = useUser();
  const { supabaseClient } = useSupabaseClient();
  const { openToast } = useCustomToast();

  const createBucketItemMutation = useMutation(
    async (item: TCreateBucketItem) => {
      await createBucketItem(supabaseClient)({ user, selectedGroupId, item });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BUCKET_ITEM_KEY.all);
      },
      onError: (err: any) => {
        throw new Error(err.message);
      },
    }
  );

  const updateBucketItemMutation = useMutation(
    async (item: TUpdateBucketItem) => {
      await updateBucketItem(supabaseClient)(item);
    },
    {
      onSuccess: () => {
        openToast({ message: '수정되었습니다.', type: 'success' });
        queryClient.invalidateQueries(BUCKET_ITEM_KEY.all);
      },
      onError: (err: any) => {
        openToast({ message: '수정할 수 없습니다.', type: 'error' });
        throw new Error(err.message);
      },
    }
  );

  const deleteBucketItemMutation = useMutation(
    async (id: number) => {
      await deleteBucketItem(supabaseClient)(id);
    },
    {
      onSuccess: () => {
        openToast({ message: '삭제되었습니다.', type: 'success' });
        queryClient.invalidateQueries(BUCKET_ITEM_KEY.all);
      },
      onError: (err: any) => {
        openToast({ message: '삭제할 수 없습니다.', type: 'error' });
        throw new Error(err.message);
      },
    }
  );

  const completeBucketItemMutation = useMutation(
    async ({ id, completed }: { id: number; completed: boolean }) => {
      await completeBucketItem(supabaseClient)({ id, completed });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BUCKET_ITEM_KEY.all);
      },
      onError: (err: any) => {
        throw new Error(err.message);
      },
    }
  );

  return { deleteBucketItemMutation, createBucketItemMutation, updateBucketItemMutation, completeBucketItemMutation };
};
