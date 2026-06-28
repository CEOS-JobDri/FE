"use client";

import { useState } from "react";
import { usePartLeaderVote, useDemodayData } from "@/hooks/useVoteData";
// ❌ 기존: import PartLeaderProfileView from "@/components/vote/PartLeaderProfileView";
// ✅ 수정: 투표 리스트 뷰를 임포트해야 합니다!
import PartLeaderVoteView from "@/components/vote/PartLeaderVoteView";
import DemoDayVoteView from "@/components/vote/DemodayVoteView";
import { DEMO_DAY_TEAMS } from "@/data/teams";
import AppHeader from "@/components/AppHeader";

// (선택) 서버에서 팀 목록을 따로 안 준다면 프론트에서 하드코딩 배열로 들고 있어야 맵핑이 가능합니다.

export default function VoteClient() {
  const [view, setView] = useState<"entry" | "part" | "demo">("entry");
  const [showDemoResult, setShowDemoResult] = useState(false); // 데모데이 결과 토글 상태

  const partData = usePartLeaderVote();
  const demoData = useDemodayData();

  return (
    <div className="app-container app-page-stack">
      <main>
        <AppHeader />
        {view === "entry" && (
          <div className="vote-entry-list flex flex-col gap-4 items-center justify-center h-screen">
            <button
              className="main-menu-card"
              onClick={() => {
                setView("part");
                partData.sync("FRONTEND"); // 뷰 진입 시 프론트엔드 데이터 동기화
              }}
            >
              파트장 투표
            </button>
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg"
              onClick={() => {
                setView("demo");
                demoData.sync();
              }}
            >
              데모데이 투표
            </button>
          </div>
        )}

        {view === "part" && (
          <PartLeaderVoteView
            // 프론트엔드 후보와 결과 데이터 매핑
            // ✅ candidates 전체를 넘겨줍니다.
            candidates={partData.candidates}
            // ✅ results 전체를 넘겨줍니다.
            results={partData.results}
            isBusy={partData.isBusy}
            onVote={partData.vote}
            onShowResult={() => partData.sync("FRONTEND")}
            onShowProfile={(id) =>
              console.log("프로필 보기 로직 추가 필요:", id)
            }
            onBack={() => setView("entry")}
          />
        )}

        {view === "demo" && (
          <DemoDayVoteView
            teams={DEMO_DAY_TEAMS} // 팀 배열 전달
            results={demoData.results} // 득표 결과 객체 전달
            isBusy={demoData.isBusy}
            showResults={showDemoResult} // 결과 보기 상태 전달
            onVote={(teamId) => demoData.vote(teamId)}
            onShowResult={() => {
              demoData.sync();
              setShowDemoResult(!showDemoResult); // 결과 보기 토글
            }}
          />
        )}
      </main>
    </div>
  );
}
