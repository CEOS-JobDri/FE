import { VoteResultItem } from "@/types/vote";
import Button from "@/components/common/Button";

interface ResultProps {
  title: string;
  items: VoteResultItem[]; // 위에서 정의한 공통 타입
  onBack: () => void;
}

export default function ResultView({ title, items, onBack }: ResultProps) {
  // 득표순 정렬은 공통 로직
  const sortedItems = [...items].sort((a, b) => b.count - a.count);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="flex flex-col gap-3">
        {sortedItems.map((item, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex justify-between items-center ${isFirst ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-3">
                {isFirst && <span className="text-2xl">👑</span>}
                <span
                  className={`font-bold ${isFirst ? "text-yellow-700" : "text-gray-700"}`}
                >
                  {item.name}
                </span>
              </div>
              <span
                className={`font-bold ${isFirst ? "text-yellow-700" : "text-gray-500"}`}
              >
                {item.count}표
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-8">
        <Button label="돌아가기" onClick={onBack} />
      </div>
    </section>
  );
}
