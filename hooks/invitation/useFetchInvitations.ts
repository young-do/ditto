import { INVITATION_KEY } from '@/utils/const';
import { useQuery } from '@tanstack/react-query';
import { createInvitation, getInvitationsByUserId } from '@/lib/supabase/client-apis/invitation';
import { useSupabaseClient } from '@/store/useSupabaseClient';

/**
 * 내가 생성한 초대 정보 중 유효한 것 하나를 가져온다.
 */
export const useFetchInvitations = (user_id?: number, group_id?: number | null) => {
  const { supabaseClient } = useSupabaseClient();

  return useQuery(
    INVITATION_KEY.list([user_id, group_id]),
    async () => {
      if (!user_id || !group_id) throw 'invalid params';
      const invitations = await getInvitationsByUserId(supabaseClient)(user_id, group_id);
      if (invitations.length === 0) {
        const invitation = await createInvitation(supabaseClient)(user_id, group_id);
        invitations.push(invitation);
      }
      return invitations;
    },
    {
      enabled: !!user_id && !!group_id,
    }
  );
};
