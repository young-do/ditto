import { NextRequest, NextResponse } from 'next/server';
import { joinGroup } from '@/lib/supabase/apis/group';
import { z } from 'zod';

const bodyScheme = z.object({
  group_id: z.number(),
  user_id: z.number(),
  joined_by: z.number(),
});

export const POST = async (req: NextRequest) => {
  try {
    // 1. body parsing
    // 2. 해당 그룹에 참여

    const body = await req.json();
    const { user_id, group_id, joined_by } = bodyScheme.parse(body);

    await joinGroup(user_id, group_id, joined_by);

    return new NextResponse(JSON.stringify({ message: 'ok' }), {
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  } catch (error) {
    return new NextResponse(
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
  }
};
