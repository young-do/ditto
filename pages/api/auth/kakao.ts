import { supabase } from '@/lib/supabase';
import { sendMessage, setCookie } from '@/utils/api-helpers';
import { NextApiHandler } from 'next';

// export const config = {
//   runtime: 'edge',
// };

type ResponseByCode = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
};
type ResponseByToken = {
  id: number;
  properties: {
    nickname: string;
    profile_image: string;
  };
};

const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL as string;
const client_id = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY as string;

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).end();
  }

  try {
    // 엑세스 토큰 있다면 -> id 조회
    // 없지만 리프레시 토큰 있다면 -> 엑세스 토큰 재발행 -> id 조회
    // 둘 다 없다면, 둘 다 (재)발급 후 id 조회
    // id 조회는 없으면 회원가입, 있으면 정보를 우리 토큰으로 담아서 제공

    const prev_access_token = req.cookies.access_token;
    const prev_refresh_token = req.cookies.refresh_token;
    let user_access_token = prev_access_token;

    if (!user_access_token) {
      if (prev_refresh_token) {
        // 엑세스 토큰 재발급
        const { access_token, expires_in } = await reissueAccessTokenByRefreshToken(prev_refresh_token);

        setCookie(res, [{ name: 'access_token', value: access_token, options: { maxAge: expires_in } }]);

        user_access_token = access_token;
      } else {
        // 두 토큰 모두 재발급
        const code = req.query.code as string | undefined;
        if (code === undefined) {
          return sendMessage(res, 400, 'empty code');
        }

        const responseByCode = await reissueAccessTokenByCode(code);
        const { access_token, expires_in, refresh_token, refresh_token_expires_in } = responseByCode;

        setCookie(res, [
          { name: 'access_token', value: access_token, options: { maxAge: expires_in } },
          { name: 'refresh_token', value: refresh_token, options: { maxAge: refresh_token_expires_in } },
        ]);

        user_access_token = access_token;
      }
    }

    const {
      id,
      properties: { nickname, profile_image },
    } = await fetchKakaoUserInfoByAccessToken(user_access_token);

    const oauth_id = `kakao:${id}`;

    let found = (await supabase.from('users').select('*').eq('oauth_id', oauth_id)).data?.[0];

    if (!found) {
      const { data, error } = await supabase.from('users').insert({ oauth_id, nickname, profile_image }).select();
      found = data?.[0];
      if (error || !found) throw error;
    } else {
      const { data, error } = await supabase
        .from('users')
        .update({ nickname, profile_image })
        .eq('id', found.id)
        .select();
      found = data?.[0];
      if (error || !found) throw error;
    }

    return sendMessage(res, 200, 'ok', { found });
  } catch (error) {
    return sendMessage(res, 400, 'bad request');
  }
};

const reissueAccessTokenByRefreshToken = async (refresh_token: string) => {
  // 엑세스 토큰 재발급
  const requestData = {
    grant_type: 'refresh_token',
    refresh_token,
    client_id,
  };
  const urlencoded = new URLSearchParams(requestData);
  const responseByRefreshToken: ResponseByCode = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'post',
    body: urlencoded.toString(),
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  }).then((res) => res.json());

  if (responseByRefreshToken.access_token == null) throw 'empty access token';
  return responseByRefreshToken;
};

const reissueAccessTokenByCode = async (code: string) => {
  const requestData = {
    grant_type: 'authorization_code',
    code,
    redirect_uri,
    client_id,
  };
  const urlencoded = new URLSearchParams(requestData);
  const responseByCode: ResponseByCode = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'post',
    body: urlencoded.toString(),
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  }).then((res) => res.json());

  if (responseByCode.access_token == null) throw 'empty access token';
  return responseByCode;
};

const fetchKakaoUserInfoByAccessToken = async (access_token: string) => {
  const responseByToken: ResponseByToken = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  }).then((res) => res.json());

  return responseByToken;
};

export default handler;
