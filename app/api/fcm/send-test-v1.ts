import { EdgeFunction } from '@/lib/edge/types';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createFcmAccessToken } from '@/lib/auth/fcm';

export const config = {
  runtime: 'edge',
};

const bodyScheme = z.object({
  /** push 메시지 보낼 target fcm token */
  fcm_token: z.string(),
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
    // NOTE: fcm 메시지 전송 테스트용 api. 로컬 개발 시에만 허용함
    if (process.env.NODE_ENV !== 'development') throw 'only works in dev env';

    const body = await req.json();
    const {
      fcm_token,
      notification_title,
      notification_body,
      notification_icon,
      notification_click_action,
      //
    } = bodyScheme.parse(body);

    const fcmTokens = [fcm_token];

    const projectId = process.env.NEXT_PUBLIC_FCM_PROJECT_ID as string;
    const fcmAccessToken = await createFcmAccessToken();
    const results = await Promise.all(
      fcmTokens.map(async (token) => {
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
                priority: 'high',
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
                  body: 'webpush body',
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
