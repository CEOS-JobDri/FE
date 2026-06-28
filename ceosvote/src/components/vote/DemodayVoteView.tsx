"use client";

import { useState } from "react";
import Button from "@/components/common/Button";

// ✅ 실제 넘어오는 팀 데이터 구조에 맞게 타입 정의
export interface DemoTeam {
  id: string;
  name: string;
  apiTeam: string;
}

interface DemoDayVoteViewProps {
  teams?: DemoTeam[]; // 👈 string[] 에서 객체 배열로 변경
  results?: Record<string, number>;
  isBusy: boolean;
  onVote: (teamId: string) => void;
  onShowResult: () => void;
  showResults: boolean;
}

export default function DemoDayVoteView({
  teams = [],
  results = {},
  isBusy,
  onVote,
  onShowResult,
  showResults,
}: DemoDayVoteViewProps) {
  // 선택된 팀의 고유값(apiTeam)을 저장하도록 상태 관리
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  return (
    <section className="demo-vote-panel">
      <div className="demo-team-grid grid grid-cols-2 gap-4 mb-6">
        {teams?.map((team) => (
          <article
            key={team.id} // 👈 객체의 고유 id를 key로 사용
            className={`team-card p-4 border rounded-xl cursor-pointer transition-colors ${
              selectedTeam === team.apiTeam
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedTeam(team.apiTeam)} // 투표용 식별자로 apiTeam 사용
          >
            <div className="team-card-content text-center">
              <h2 className="text-xl font-bold">{team.name}</h2>{" "}
              {/* 화면에는 한글 이름 표시 */}
              {showResults && (
                <div className="mt-2 text-lg font-semibold text-blue-600">
                  {results[team.apiTeam] || 0} 표{" "}
                  {/* 득표 결과도 apiTeam 기준으로 매핑 */}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="vote-actions flex justify-center gap-4">
        <Button
          label="투표하기"
          size="large"
          className="action-button-primary"
          disabled={!selectedTeam || isBusy}
          onClick={() => selectedTeam && onVote(selectedTeam)} // apiTeam 값을 넘겨줌
        />
        <Button
          label={showResults ? "결과 숨기기" : "결과보기"}
          styleType="secondary"
          size="large"
          disabled={isBusy}
          onClick={onShowResult}
        />
      </div>
    </section>
  );
}
