import { createCredentials } from '@/utils/auth';
import { SUPABASE_URL } from '@/utils/const';
import { createClient } from '@supabase/supabase-js';
import { Database } from './schema';

// @note: 절대 노출되면 안되는 키
const secret = process.env.NEXT_PUBLIC_SUPABASE_SECRET as string;
const adminSupabaseClient = createClient<Database>(SUPABASE_URL, secret);

const findUserByOauthId = async (oauth_id: string) => {
  const { data } = await adminSupabaseClient.from('users').select().eq('oauth_id', oauth_id);
  return data?.[0];
};

const signUpUser = async (oauth_id: string, nickname: string, profile_image?: string) => {
  // insert user on db
  const { data, error: errorOnInsert } = await adminSupabaseClient
    .from('users')
    .insert({ oauth_id, nickname, profile_image })
    .select();
  const user = data?.[0];

  if (errorOnInsert || !user) throw errorOnInsert;

  // sign up for auth
  const { error: errorOnSignup } = await adminSupabaseClient.auth.admin.createUser({
    ...createCredentials(user.id, oauth_id),
    email_confirm: true,
  });
  if (errorOnSignup) throw errorOnSignup;

  return user;
};

const updateUserInfo = async (user_id: number, nickname: string, profile_image?: string) => {
  const { data, error } = await adminSupabaseClient
    .from('users')
    .update({ nickname, profile_image })
    .eq('id', user_id)
    .select();
  const updatedUser = data?.[0];
  if (error || !updatedUser) throw error;

  return updatedUser;
};

/**
 * @note 오직 server side에서만 호출되어야 함
 */
export const adminApi = {
  findUserByOauthId,
  signUpUser,
  updateUserInfo,
};
