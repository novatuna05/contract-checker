import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '콘트렉체커 - 전세사기 감시자',
  description: '계약서를 분석하여 전세사기 위험도를 판단하는 AI 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
