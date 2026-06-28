"use client";

import { useState } from "react";
import { usePartLeaderVote, useDemodayData } from "@/hooks/useVoteData";
import PartLeaderVoteView from "@/components/vote/PartLeaderVoteView";
import DemoDayVoteView from "@/components/vote/DemodayVoteView";
import { DEMO_DAY_TEAMS } from "@/data/teams";
import AppHeader from "@/components/AppHeader";
import Image from "next/image"; // ✅ Image 임포트

export default function VoteClient() {
  const [view, setView] = useState<"entry" | "part" | "demo">("entry");
  const [showDemoResult, setShowDemoResult] = useState(false);

  const partData = usePartLeaderVote();
  const demoData = useDemodayData();

  return (
    <div className="app-page">
      <div className="app-container app-page-stack">
        <AppHeader />

        <main className="main-menu" aria-label="투표 메뉴">
          {view === "entry" && (
            <>
              {/* 파트장 투표 카드 */}
              <button
                className="main-menu-card"
                onClick={() => {
                  setView("part");
                  partData.sync("FRONTEND");
                }}
              >
                <span className="main-menu-icon" aria-hidden="true">
                  <Image
                    src="/ic_part-vote.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </span>
                <span className="main-menu-label text-t20-semibold">
                  파트장 투표
                </span>
              </button>

              {/* 데모데이 투표 카드 */}
              <button
                className="main-menu-card"
                onClick={() => {
                  setView("demo");
                  demoData.sync();
                }}
              >
                <span className="main-menu-icon" aria-hidden="true">
                  <Image
                    src="/ic_demo-vote.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </span>
                <span className="main-menu-label text-t20-semibold">
                  데모데이 투표
                </span>
              </button>
            </>
          )}

          {/* 투표 뷰들 (view 상태에 따라 렌더링) */}
          {view === "part" && (
            <PartLeaderVoteView
              candidates={partData.candidates}
              results={partData.results}
              isBusy={partData.isBusy}
              onVote={partData.vote}
              onShowResult={(part) => partData.sync(part)}
              onShowProfile={(id) => console.log("프로필:", id)}
              onBack={() => setView("entry")}
              onPartChange={(part) => partData.sync(part)}
            />
          )}

          {view === "demo" && (
            <DemoDayVoteView
              teams={DEMO_DAY_TEAMS}
              results={demoData.results}
              isBusy={demoData.isBusy}
              showResults={showDemoResult}
              onVote={(teamId) => demoData.vote(teamId)}
              onShowResult={() => {
                demoData.sync();
                setShowDemoResult(!showDemoResult);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
