# AI 트렌드 레이더

매일 아침 9시(KST), AI 모델·제품·연구·산업·정책 소식을 자동으로 모아 쌓아두는 개인 아카이브입니다.

## 구조

- `data/entries.json` — 수집된 소식 전체. 매일 새 항목이 이 배열 앞쪽에 추가됩니다.
- `data/glossary.json` — 어려운 용어 사전. 소식에 새 용어가 나오면 같이 추가됩니다.
- `app/page.tsx` — 오늘의 소식 피드 (최신순, 카테고리 필터, 저장 기능)
- `app/archive/page.tsx` — 전체 흐름을 표로 보는 아카이브 페이지
- `components/` — 피드/테이블/용어 사이드바 등 UI 컴포넌트

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포

Vercel에 이 레포지토리를 Import하면 자동으로 빌드·배포됩니다. 별도 환경 변수는 필요 없습니다 (모든 데이터가 `data/*.json` 정적 파일 기반).

## 자동 업데이트

매일 오전 9시(KST)에 예약된 클라우드 에이전트가 최신 AI 소식을 검색해 `data/entries.json`과 `data/glossary.json`을 갱신하고 커밋·푸시합니다. Vercel이 push를 감지해 자동으로 재배포합니다.
