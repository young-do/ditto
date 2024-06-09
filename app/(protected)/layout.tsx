'use client';

import { SplashPage } from '@/components/loading/SplashPage';
import { useFirebaseMessaging } from '@/hooks/useFirebaseMessaging';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const redirectUrl = '/';

function Protected({ children }: { children: React.ReactNode }) {
  const { showLoadingPage } = useProtectedRoute(redirectUrl);

  useFirebaseMessaging();

  return showLoadingPage ? <SplashPage /> : children;
}

export default Protected;
