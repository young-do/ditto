import { isNonNullable, pickFirst } from '@/utils/array';
import { SupabaseClient } from '../client';
import { Group } from '../type';

export const createGroup = (supabase: SupabaseClient) => async (user_id: number, group_name: string) => {
  const { data, error } = await supabase.from('groups').insert({ owner_id: user_id, name: group_name }).select();
  const group = data?.[0];
  if (!group || error) throw error;
  return group;
};

export const joinGroup =
  (supabase: SupabaseClient) => async (user_id: number, group_id: number, joined_by?: number) => {
    const { error } = await supabase.from('group_members').insert({
      group_id,
      user_id,
      joined_by,
    });
    if (error) throw error;
    return;
  };

export const createDefaultBucketFolder = (supabase: SupabaseClient) => async (user_id: number, group_id: number) => {
  const { error } = await supabase.from('bucket_folders').insert([
    {
      creator_id: user_id,
      group_id,
      title: '가고 싶은 곳',
    },
    {
      creator_id: user_id,
      group_id,
      title: '먹고 싶은 음식',
    },
  ]);
  if (error) throw error;
  return;
};

export const getJoinedGroupList = (supabase: SupabaseClient) => async (user_id: number) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`*, groups (*)`)
    .eq('user_id', user_id)
    .order('joined_time', { ascending: true });
  const joinedGroupList = (data ?? []).map((item) => pickFirst(item.groups)).filter(isNonNullable);
  if (error) throw error;
  return joinedGroupList;
};

export const getGroup = (supabase: SupabaseClient) => async (group_id: number) => {
  const { data, error } = await supabase.from('groups').select().eq('id', group_id);
  const group = data?.[0];
  if (error || !group) throw error;
  return group;
};

export const updateGroup =
  (supabase: SupabaseClient) => async (group_id: number, values: Pick<Partial<Group>, 'name' | 'is_opened_events'>) => {
    const { data, error } = await supabase.from('groups').update(values).eq('id', group_id).select();
    const group = data?.[0];
    if (error || !group) throw error;
    return group;
  };
