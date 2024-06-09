import { useUser } from '@/store/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useProtectedRoute = (redirectUrl = '/') => {
  const router = useRouter();
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  // @note:
  // 로그인 전에 로딩 페이지를 보여주는 이유는
  // 로그인 되기 전에 supabase를 통해 api 호출하면 signIn이 되어있지 않아 아무값을 못 얻게되기 때문입니다.
  useEffect(() => {
    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    const run = async () => {
      const result = await Promise.race([
        // 로그인이 실패해도 다음 로직을 실행하기 위해 catch로 에러를 잡아줍니다.
        login().catch(() => null),

        // 너무 짧은 시간 동안 스플래시 페이지가 보여지면 깜빡거리는 느낌을 받을 수 있기 때문에
        // 최소 1초 동안은 스플래시 페이지를 보여주도록 합니다.
        wait(1000),
      ]);

      if (!result) {
        router.replace(redirectUrl);
      } else {
        setIsLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { showLoadingPage: isLoading };
};
