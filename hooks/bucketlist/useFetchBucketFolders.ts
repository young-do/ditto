import { useQuery } from '@tanstack/react-query';
import { BucketFolder } from '@/lib/supabase/type';
import { useUser } from '@/store/useUser';
import { BUCKET_FOLDER_KEY } from '@/utils/const';
import { getBucketFolders } from '@/lib/supabase/client-apis/bucketlist';
import { useSupabaseClient } from '@/store/useSupabaseClient';

export const useFetchBucketFolders = () => {
  const { selectedGroupId } = useUser();
  const { supabaseClient } = useSupabaseClient();

  if (!selectedGroupId) throw new Error('selectedGroupId is null');

  const fetcher = async () => {
    const response = await getBucketFolders(supabaseClient)(selectedGroupId);
    return response;
  };
  return useQuery<BucketFolder[], Error>(BUCKET_FOLDER_KEY.list([selectedGroupId]), fetcher);
};
