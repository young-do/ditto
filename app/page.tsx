'use client';

import MainLayout from '@/components/layouts/MainLayout';
import { joinGroup } from '@/lib/supabase/client-apis/group';
import { useUser } from '@/store/useUser';
import { KAKAO_LOGIN_URL } from '@/utils/const';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { KakaoIcon, LoginChecklistIcon, LoginInvitationIcon } from '@/components/icons';
import styled from '@emotion/styled';
import { useFetchInvitationInfo } from '@/hooks/invitation/useFetchInvitationInfo';
import { useFetchJoinedGroupList } from '@/hooks/group/useFetchJoinedGroupList';
import { Heading } from '@chakra-ui/react';
import theme from '@/styles/theme';
import { useSupabaseClient } from '@/store/useSupabaseClient';

// @note: root page flow
// 1-1. 로그인 여부 확인 -> 로그인되어 있다면 참여한 그룹 리스트 확인
// 1-2. 초대코드로 그룹 정보 확인
//
// 2-1. 로그인 x -> 초대코드 유효 시 초대 메시지 노출
//                 그렇지 않다면 웰컴 메시지 노출
// 2-2. 로그인 o -> 초대코드 유효 시 해당 그룹에 가입되어 있는지 확인
//                 -> 가입되어 있지 않다면, 자동 가입 후 해당 그룹 홈으로 이동
//                    가입되어 있다면, 해당 그룹 홈으로 이동
//                초대코드 유효하지 않으면 속한 그룹 중 하나의 홈으로 이동.

const RootPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? searchParams.get('state');

  const { user, isLoading: isLoadingUser, selectedGroupId, setGroupId, login } = useUser();
  const { data: invitationInfo, isLoading: isLoadingInvitationInfo } = useFetchInvitationInfo(code);
  const { data: joinedGroupList = [], isLoading: isLoadingJoinedGroupList } = useFetchJoinedGroupList(user);
  const { supabaseClient } = useSupabaseClient();

  useEffect(() => {
    // @note: 자동 로그인
    login().catch(() => null);
  }, [login]);

  useEffect(() => {
    if (isLoadingUser || !user) return;
    if (isLoadingJoinedGroupList) return;
    if (code && isLoadingInvitationInfo) return;

    (async () => {
      if (invitationInfo) {
        const needToJoin = joinedGroupList.every((group) => group.id !== invitationInfo.group_id);
        if (needToJoin) {
          await joinGroup(supabaseClient)(user.id, invitationInfo.group_id, invitationInfo.creator_id);
        }
        setGroupId(invitationInfo.group_id);
        return router.replace('/bucketlist');
      }

      if (joinedGroupList.length > 0) {
        if (!selectedGroupId) {
          setGroupId(joinedGroupList[0].id);
        }
        return router.replace('/bucketlist');
      } else {
        return router.replace('/no-group');
      }
    })();
  }, [
    code,
    user,
    isLoadingUser,
    isLoadingJoinedGroupList,
    isLoadingInvitationInfo,
    joinedGroupList,
    invitationInfo,
    setGroupId,
    selectedGroupId,
    router,
    supabaseClient,
  ]);

  return (
    <MainLayout hideBottomNavigation>
      <Container>
        <WelcomeMessage>
          {invitationInfo ? (
            <>
              <b>{invitationInfo?.users.nickname}</b>님이
              <br />
              당신을
              <br />
              <b>{invitationInfo?.groups.name}</b>로<br />
              초대합니다.
            </>
          ) : (
            '가까운 사람들과\n일정, 버킷리스트를\n함께 작성하고\n관리해보세요.'
          )}
        </WelcomeMessage>

        <Space />

        <LoginIconWrap>{invitationInfo ? <LoginInvitationIcon /> : <LoginChecklistIcon />}</LoginIconWrap>

        <KakaoLoginButtonWrap>
          <KakaoLoginButton as="a" href={KAKAO_LOGIN_URL(code)}>
            <KakaoIcon />
            <KakaoLoginButtonText>카카오 로그인</KakaoLoginButtonText>
          </KakaoLoginButton>
        </KakaoLoginButtonWrap>
      </Container>
    </MainLayout>
  );
};

export default RootPage;

const Container = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
const WelcomeMessage = styled(Heading)`
  padding: 56px 28px 0;
  font-weight: 400;
  font-size: 36px;
  line-height: 1.5;
  letter-spacing: -0.02em;
  white-space: pre-line;
  text-align: left;
`;
const KakaoLoginButtonWrap = styled.div`
  width: 100%;
  padding: 0 20px 28px 20px;
`;
const KakaoLoginButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  background-color: ${theme.colors.kakaoBgColor};
`;
const KakaoLoginButtonText = styled.span`
  margin-left: 4px;
  ${theme.textStyles.buttonMedium};
  color: ${theme.colors.black};
`;
const Space = styled.div`
  flex: 1;
`;
const LoginIconWrap = styled.div`
  width: 100%;
  padding: 0 26px 72px;
  text-align: right;
  svg {
    display: inline-block;
  }
`;
