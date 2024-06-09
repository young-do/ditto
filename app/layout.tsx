import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@/components/ga/GoogleAnalytics';

import { Providers } from './_providers';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      {/* @note: meta 태그를 manifest 변수로 마이그레이션 염두가 안나서 기존 버전 방식 유지 */}
      <title>Ditto</title>
      <meta name="application-name" content="Ditto" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Ditto" />
      <meta name="description" content="그룹 일정 & 버킷리스트 서비스" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="msapplication-tap-highlight" content="no" />

      <meta name="theme-color" content="#ffffff" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
      <GoogleAnalytics />
      <body>
        <Providers>{children}</Providers>
        <VercelAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
