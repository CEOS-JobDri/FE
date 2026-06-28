import { useState } from "react";
import { submitPartVote, submitTeamVote } from "@/services/vote";
import { getCandidates } from "@/services/auth";
import { PartLeaderPart, PartLeaderCandidate } from "@/types/profile";
import { DEMO_DAY_TEAMS } from "@/data/teams";

export function usePartLeaderVote() {
  const [candidates, setCandidates] = useState<
    Record<PartLeaderPart, PartLeaderCandidate[]>
  >({
    FRONTEND: [],
    BACKEND: [],
  });
  const [results, setResults] = useState<
    Record<PartLeaderPart, Record<number, number>>
  >({
    FRONTEND: {},
    BACKEND: {},
  });
  const [isBusy, setIsBusy] = useState(false);

  const sync = async (part: PartLeaderPart) => {
    setIsBusy(true);
    try {
      // 파트별 후보 조회
      const apiCandidates = await getCandidates(part);
      const validCandidates = apiCandidates || [];

      setCandidates((prev) => ({ ...prev, [part]: validCandidates }));

      const newResults: Record<number, number> = {};

      // ✅ 여기도 깔끔하게 c의 타입을 유추하도록 그냥 둡니다. (이미 validCandidates가 PartLeaderCandidate[]이므로!)
      validCandidates.forEach((c) => {
        newResults[c.id] = c.voteCount ?? 0;
      });

      setResults((prev) => ({ ...prev, [part]: newResults }));
    } catch (error) {
      console.error(`${part} 파트 후보자를 불러오는데 실패했습니다.`, error);
      setCandidates((prev) => ({ ...prev, [part]: [] }));
      setResults((prev) => ({ ...prev, [part]: {} }));
    } finally {
      setIsBusy(false);
    }
  };

  const vote = async (part: PartLeaderPart, id: number) => {
    console.log("투표할 ID:", id); // ✅ 여기서 숫자가 정확히 찍히는지 확인!
    if (!id) {
      alert("선택된 후보자가 없습니다.");
      return;
    }
    setIsBusy(true);
    try {
      // 서버 전송 (반드시 id 전달)
      await submitPartVote(id);
      alert("투표가 성공적으로 완료되었습니다!");
      await sync(part); // 최신 데이터 동기화
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "투표 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsBusy(false);
    }
  };

  return { candidates, results, isBusy, sync, vote };
}

// 2. 데모데이 투표 훅
const MOCK_DATA: Record<string, number> = {
  CONX: 0,
  DITDA: 0,
  GROUPEAT: 0,
  IPX: 0,
  JOBDRI: 0,
};

export function useDemodayData() {
  const [results, setResults] = useState<Record<string, number>>({});
  const [isBusy, setIsBusy] = useState(false);

  const sync = async () => {
    setIsBusy(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setResults((prev) => (Object.keys(prev).length > 0 ? prev : MOCK_DATA));
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    } finally {
      setIsBusy(false);
    }
  };

  const vote = async (teamId: string) => {
    setIsBusy(true);
    try {
      await submitTeamVote(teamId);
      alert("투표가 성공적으로 완료되었습니다!");
      setResults((prev) => ({
        ...prev,
        [teamId]: (prev[teamId] || 0) + 1,
      }));
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "투표 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsBusy(false);
    }
  };

  return { teams: DEMO_DAY_TEAMS, results, isBusy, sync, vote };
}
