import entries from "@/data/entries.json";
import glossary from "@/data/glossary.json";
import { TrendEntry, Glossary } from "@/lib/types";
import TrendTable from "@/components/TrendTable";

export const revalidate = 0;

export default function ArchivePage() {
  return (
    <div>
      <div className="page-head">
        <h1>전체 흐름</h1>
        <p>지금까지 쌓인 모든 소식을 표로 모아봅니다. 날짜순으로 정렬되어 있어 흐름을 한눈에 훑어볼 수 있습니다.</p>
      </div>
      <TrendTable entries={entries as TrendEntry[]} glossary={glossary as Glossary} />
    </div>
  );
}
