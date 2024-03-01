import { EdgeFunction } from '@/lib/edge/types';
import { NextResponse } from 'next/server';
import { COOKIE_KAKAO_ACCESS_TOKEN_NAME, COOKIE_KAKAO_REFRESH_TOKEN_NAME } from '@/utils/const';
import { adminApi } from '@/lib/supabase/admin';
import { z } from 'zod';
import { createFcmAccessToken } from '@/lib/auth/fcm';

export const config = {
  runtime: 'edge',
};

const bodyScheme = z.object({
  /** 보내는 유저 id. push 메시지 보낼 때 이 유저는 제외된다. */
  sender_id: z.number(),
  /** push 메시지 보낼 그룹 id */
  group_id: z.number(),
  /** push 메시지 제목 */
  notification_title: z.string(),
  /** push 메시지 내용 */
  notification_body: z.string(),
  /** push 메시지 아이콘 */
  notification_icon: z.string(),
  /** push 메시지 클릭 시 이동할 url */
  notification_click_action: z.string(),
});

const edgeFunction: EdgeFunction = async (req) => {
  try {
    const refreshToken = req.cookies.get(COOKIE_KAKAO_REFRESH_TOKEN_NAME)?.value;
    const accessToken = req.cookies.get(COOKIE_KAKAO_ACCESS_TOKEN_NAME)?.value;

    if (!refreshToken || !accessToken) throw 'no authorized';

    const body = await req.json();
    const {
      sender_id,
      group_id,
      notification_title,
      notification_body,
      notification_icon,
      notification_click_action,
      //
    } = bodyScheme.parse(body);

    // 1. 푸시 알림을 보내기 위한 그룹 내 다른 멤버 token들을 가져온다
    const fcmTokens = await adminApi.getFcmTokenListByGroupId(sender_id, group_id);

    // 2. fcm access token을 생성한다
    // 비고: access token을 얻어오는 함수인 createFcmAccessToken는 공식 라이브러리를 사용한 것이 아니므로
    //      (공식 라이브러리는 edge runtime에서 사용할 수 없음)
    //      문제가 될 수 있음을 미리 언급해둔다
    const projectId = process.env.NEXT_PUBLIC_FCM_PROJECT_ID as string;
    const fcmAccessToken = await createFcmAccessToken();

    // 3. firebase http v1 호출을 통해 푸시 알림을 보낸다
    const results = await Promise.all(
      fcmTokens.map(async ({ token }) => {
        // docs link: https://firebase.google.com/docs/cloud-messaging/http-server-ref?hl=ko
        // https://firebase.google.com/docs/cloud-messaging/migrate-v1?hl=ko#node.js
        const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
          method: 'post',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
            Authorization: `${fcmAccessToken.token_type} ${fcmAccessToken.access_token}`,
          },
          body: JSON.stringify({
            message: {
              // @note: 비활성화 앱을 활성화시키기 위해 아래 두 옵션을 추가함
              token,
              notification: {
                title: notification_title,
                body: notification_body,
              },
              android: {
                collapse_key: 'ditto',
                priority: 'HIGH',
                notification: {
                  icon: notification_icon,
                  click_action: notification_click_action,
                },
              },
              webpush: {
                headers: {
                  TTL: '60',
                },
                notification: {
                  icon: notification_icon,
                },
                fcm_options: {
                  link: notification_click_action,
                },
              },
              // TODO: ios web push 설정은 추후에...
              // apns: {},
            },
          }),
        });
        return await res.json();
      })
    );

    const res = new NextResponse(
      JSON.stringify({
        message: 'ok',
        data: { results },
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      }
    );
    return res;
  } catch (error) {
    const res = new NextResponse(
      JSON.stringify({
        message: 'bad request',
        error,
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      }
    );
    return res;
  }
};

export default edgeFunction;
