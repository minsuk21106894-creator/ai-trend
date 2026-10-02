import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 트렌드 레이더",
  description: "매일 아침 AI 트렌드·모델·제품·연구 소식을 모아 쌓아두는 개인 아카이브",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap site-header-inner">
            <Link href="/" className="site-title">
              <span className="dot" />
              AI 트렌드 레이더
            </Link>
            <nav className="site-nav">
              <Link href="/">오늘의 소식</Link>
              <Link href="/archive">전체 흐름</Link>
            </nav>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            매일 오전 9시(KST) 자동 수집 · 모델·제품·연구·산업·정책 소식을 핵심만 요약해 쌓아둡니다.
          </div>
        </footer>
      </body>
    </html>
  );
}
