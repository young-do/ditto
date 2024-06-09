import { SupabaseClient } from '@/lib/supabase/client';
import {
  TCreateBucketFolderParams,
  TCreateBucketItemParams,
  TUpdateBucketFolder,
  TUpdateBucketItem,
} from '@/lib/supabase/client-apis/bucketlist/type';
import { BucketFolder, TBucketItem } from '@/lib/supabase/type';

//Bucket Item
export const getBucketItems = (supabase: SupabaseClient) => async (folderId: number) => {
  const { data, error } = await supabase
    .from('bucket_items')
    .select('*')
    .order('created_time', { ascending: false })
    .eq('bucket_folder_id', folderId);
  if (error) throw new Error(error.message);
  return data;
};

export const createBucketItem = (supabase: SupabaseClient) => async (params: TCreateBucketItemParams) => {
  const { item, user, selectedGroupId } = params;

  if (!user || !selectedGroupId) throw new Error('user or selectedGroupId is null');

  const { error } = await supabase
    .from('bucket_items')
    .insert({ ...item, creator_id: user.id, group_id: selectedGroupId });

  if (error) throw new Error(error.message);
  return;
};

export const updateBucketItem = (supabase: SupabaseClient) => async (item: TUpdateBucketItem) => {
  const { error } = await supabase
    .from('bucket_items')
    .update({ title: item.title, description: item.description })
    .eq('id', item.id);
  if (error) throw new Error(error.message);
  return;
};

export const deleteBucketItem = (supabase: SupabaseClient) => async (id: number) => {
  const { error } = await supabase.from('bucket_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return;
};

export const completeBucketItem =
  (supabase: SupabaseClient) =>
  async ({ id, completed }: { id: number; completed: boolean }) => {
    const { error } = await supabase.from('bucket_items').update({ completed: completed }).eq('id', id);
    if (error) throw new Error(error.message);
    return;
  };

export const getUnreadBucketItems =
  (supabase: SupabaseClient) => async (user_id: number, group_id: number, last_login_time: string) => {
    const { data, error } = await supabase
      .from('bucket_items')
      .select('id, bucket_folder_id')
      .eq('group_id', group_id)
      .neq('creator_id', user_id)
      .gt('created_time', last_login_time);

    if (error) throw error;
    return data as Array<Pick<TBucketItem, 'id' | 'bucket_folder_id'>>;
  };

//Bucket Folder
export const getBucketFolders =
  (supabase: SupabaseClient) =>
  async (groupId: number): Promise<BucketFolder[]> => {
    const { data, error } = await supabase
      .from('bucket_folders')
      .select('*')
      .order('created_time', { ascending: true })
      .eq('group_id', groupId);
    if (error) throw new Error(error.message);
    return data;
  };

export const getBucketFolderById =
  (supabase: SupabaseClient) =>
  async (id: number): Promise<BucketFolder> => {
    const { data, error } = await supabase.from('bucket_folders').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  };

export const createBucketFolder = (supabase: SupabaseClient) => async (params: TCreateBucketFolderParams) => {
  const { folder, user, selectedGroupId } = params;

  if (!user || !selectedGroupId) throw new Error('user or selectedGroupId is null');

  const { error } = await supabase
    .from('bucket_folders')
    .insert({ ...folder, creator_id: user.id, group_id: selectedGroupId });
  if (error) throw new Error(error.message);
  return;
};

export const updateBucketFolder = (supabase: SupabaseClient) => async (folder: TUpdateBucketFolder) => {
  const { error } = await supabase.from('bucket_folders').update({ title: folder.title }).eq('id', folder.id);

  if (error) throw new Error(error.message);
  return;
};

export const deleteBucketFolder = (supabase: SupabaseClient) => async (id: number) => {
  const { error } = await supabase.from('bucket_folders').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return;
};
