"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { PartLeaderCandidate, PartLeaderPart } from "@/types/profile";

interface Props {
  // 파트별 후보 목록을 Record 객체로 받아옵니다.
  candidates: Record<PartLeaderPart, PartLeaderCandidate[]>;
  results: Record<PartLeaderPart, Record<number, number>>;
  isBusy: boolean;
  onVote: (part: PartLeaderPart, id: number) => void;
  onShowResult: () => void;
  onShowProfile: (id: number) => void;
  onBack: () => void;
}

export default function PartLeaderVoteView({
  candidates,
  results,
  isBusy,
  onVote,
  onShowResult,
  onShowProfile,
  onBack,
}: Props) {
  // 현재 선택된 파트와 후보 ID를 상태로 관리합니다.
  const [currentPart, setCurrentPart] = useState<PartLeaderPart>("FRONTEND");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const currentCandidates = candidates[currentPart];

  // 파트 변경 시 선택된 ID 초기화
  const handlePartChange = (part: PartLeaderPart) => {
    setCurrentPart(part);
    setSelectedId(null);
  };

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

      {/* 후보자 목록 렌더링 */}
      {(currentCandidates?.length ?? 0) === 0 ? (
        <p className="text-center py-10 text-gray-500">
          등록된 후보가 없습니다.
        </p>
      ) : (
        <div className="fe-candidate-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCandidates.map((candidate) => {
            // ✅ 여기서 후보자 정보를 찍어보세요. 콘솔에 { id: 1, name: '...', ... } 이렇게 나오는지 확인!
            console.log("렌더링되는 후보 정보:", candidate);

            return (
              <article
                key={`${currentPart}-${candidate.candidateId}`}
                className={`fe-candidate-card border p-4 cursor-pointer ${
                  selectedId === candidate.candidateId
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  console.log("클릭한 후보 ID:", candidate.candidateId); // ✅ 클릭 시 ID 확인
                  setSelectedId(candidate.candidateId);
                }}
              >
                <h2 className="text-xl font-bold">{candidate.name}</h2>
                <Button
                  label="투표하기"
                  size="large"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // ✅ 상태 변수를 거치지 말고, 즉시 클릭한 후보의 id를 넘김
                    onVote(currentPart, candidate.candidateId);
                  }}
                />
              </article>
            );
          })}
        </div>
      )}
      <div className="fe-vote-actions mt-8 flex gap-2">
        <Button
          label="투표하기"
          size="large"
          className="flex-1"
          disabled={selectedId === null || isBusy}
          onClick={() => {
            if (selectedId !== null) {
              console.log("투표 시도 중, ID:", selectedId); // 여기서 값이 찍히는지 확인!
              onVote(currentPart, selectedId);
            }
          }}
        />
        <Button
          label="결과보기"
          size="large"
          className="flex-1"
          onClick={onShowResult}
        />
        <Button label="돌아가기" size="large" onClick={onBack} />
      </div>
    </section>
  );
}
