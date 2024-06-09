import { useQuery } from '@tanstack/react-query';
import { TBucketItem } from '@/lib/supabase/type';
import { BUCKET_ITEM_KEY } from '@/utils/const';
import { getBucketItems } from '@/lib/supabase/client-apis/bucketlist';
import { useSupabaseClient } from '@/store/useSupabaseClient';

export const useFetchBucketItems = (folderId: number) => {
  const { supabaseClient } = useSupabaseClient();

  const fetcher = async () => {
    const bucketItems = await getBucketItems(supabaseClient)(folderId);
    return bucketItems.sort(compareByCompleted);
  };
  return useQuery<TBucketItem[], Error>(BUCKET_ITEM_KEY.list([folderId]), fetcher, {
    enabled: !!folderId,
  });
};

const compareByCompleted = (a: TBucketItem, b: TBucketItem) => {
  if (a.completed) return 1;
  if (b.completed) return -1;
  return 0;
};
