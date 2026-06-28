"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { PartLeaderCandidate, PartLeaderPart } from "@/types/profile";
import PartLeaderResultView from "./ResultView";

interface Props {
  candidates: Record<PartLeaderPart, PartLeaderCandidate[]>;
  results: Record<PartLeaderPart, Record<number, number>>;
  isBusy: boolean;
  onVote: (part: PartLeaderPart, id: number) => void;
  onShowResult: (part: PartLeaderPart) => void;
  onShowProfile: (id: number) => void;
  onBack: () => void;
  onPartChange: (part: PartLeaderPart) => void;
}

export default function PartLeaderVoteView({
  candidates,
  results,
  isBusy,
  onVote,
  onShowResult,
  onShowProfile,
  onBack,
  onPartChange,
}: Props) {
  const [currentPart, setCurrentPart] = useState<PartLeaderPart>("FRONTEND");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isResultView, setIsResultView] = useState(false);

  const currentCandidates = candidates[currentPart];

  const handlePartChange = (part: PartLeaderPart) => {
    setCurrentPart(part);
    setSelectedId(null);
    onPartChange(part);
  };

  const handleShowResult = async () => {
    await onShowResult(currentPart); // ✅ 현재 선택된 파트를 넘겨줍니다.
    setIsResultView(true);
  };

  if (isResultView) {
    return (
      <section className="fe-part-result-panel">
        <h2 className="text-2xl font-bold mb-4">투표 결과</h2>
        <PartLeaderResultView
          title={`${currentPart === "FRONTEND" ? "프론트엔드" : "백엔드"} 투표 결과`}
          items={candidates[currentPart].map((candidate) => ({
            id: candidate.candidateId,
            name: candidate.name,
            count: results[currentPart][candidate.candidateId] || 0, // ✅ count -> voteCount로 통일
          }))}
          onBack={() => setIsResultView(false)}
        />
      </section>
    );
  }

  return (
    <section className="fe-part-vote-panel">
      {/* 파트 선택 탭 */}
      <div className="flex gap-4 mb-6">
        {(["FRONTEND", "BACKEND"] as PartLeaderPart[]).map((part) => (
          <button
            key={part}
            onClick={() => handlePartChange(part)}
            className={`px-4 py-2 font-bold ${currentPart === part ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
          >
            {part === "FRONTEND" ? "프론트엔드" : "백엔드"}
          </button>
        ))}
      </div>

      {/* 후보자 목록 */}
      {(currentCandidates?.length ?? 0) === 0 ? (
        <p className="text-center py-10 text-gray-500">
          등록된 후보가 없습니다.
        </p>
      ) : (
        <div className="fe-candidate-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCandidates.map((candidate) => (
            <article
              key={`${currentPart}-${candidate.candidateId}`}
              className={`fe-candidate-card border p-4 cursor-pointer ${
                selectedId === candidate.candidateId
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedId(candidate.candidateId)}
            >
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <p>{candidate.team}</p>
            </article>
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="fe-vote-actions mt-8 flex gap-2">
        <Button
          label="투표하기"
          size="large"
          className="flex-1"
          disabled={selectedId === null || isBusy}
          onClick={() => selectedId !== null && onVote(currentPart, selectedId)}
        />
        <Button
          label="결과보기"
          size="large"
          className="flex-1"
          onClick={handleShowResult} // ✅ 수정된 핸들러 연결
        />
        <Button label="돌아가기" size="large" onClick={onBack} />
      </div>
    </section>
  );
}
