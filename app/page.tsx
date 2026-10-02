import entries from "@/data/entries.json";
import glossary from "@/data/glossary.json";
import { TrendEntry, Glossary } from "@/lib/types";
import TrendFeed from "@/components/TrendFeed";
import WeeklyDigest from "@/components/WeeklyDigest";
import StatRow from "@/components/StatRow";

export const revalidate = 0;

export default function HomePage() {
  const typedEntries = entries as TrendEntry[];
  return (
    <div>
      <div className="page-head">
        <h1>오늘의 AI 소식</h1>
        <p>모델·제품·연구·산업·정책 소식을 핵심만 요약해서 모아둡니다. 밑줄 친 단어를 누르면 바로 설명이 뜹니다.</p>
      </div>
      <StatRow entries={typedEntries} />
      <WeeklyDigest entries={typedEntries} />
      <TrendFeed entries={typedEntries} glossary={glossary as Glossary} />
    </div>
  );
}
