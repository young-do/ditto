import { useQuery } from '@tanstack/react-query';
import { BucketFolder } from '@/lib/supabase/type';
import { BUCKET_FOLDER_KEY } from '@/utils/const';
import { useSupabaseClient } from '@/store/useSupabaseClient';
import { getBucketFolderById } from '@/lib/supabase/client-apis/bucketlist';

export const useFetchBucketFolderById = (id: number) => {
  const { supabaseClient } = useSupabaseClient();

  const fetcher = async () => {
    const response = await getBucketFolderById(supabaseClient)(id);
    return response;
  };
  return useQuery<BucketFolder, Error>(BUCKET_FOLDER_KEY.detail([id]), fetcher, {
    enabled: !!id,
  });
};
