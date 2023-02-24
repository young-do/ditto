import { useQuery } from '@tanstack/react-query';
import { BucketFolder } from '@/lib/supabase/type';
import { getBucketFolderById } from '@/lib/supabase/apis/bucketlist';

export const useFetchBucketFolderById = (id: number) => {
  const fetcher = async () => {
    const response = await getBucketFolderById(id);
    return response;
  };
  return useQuery<BucketFolder, Error>(['bucketFolder', id], fetcher, {
    enabled: !!id,
    staleTime: Infinity,
  });
};
