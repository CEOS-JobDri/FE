"use client";

import Image from "next/image";
import { useState } from "react";

import AppHeader from "@/components/AppHeader";
import Button from "@/components/common/Button";
import IconOnlyButton from "@/components/common/IconOnlyButton";
import {
  getPartVoteResults,
  getTeamVoteResults,
  submitPartVote,
  submitTeamVote,
  type PartVoteResultResponse,
  type TeamVoteResultResponse,
  type VotePartApiValue,
} from "@/services/vote";
import type { UserTeam } from "@/types/auth";
import { getAuthUser, getToken } from "@/utils/auth";

type PartLeaderPart = "fe" | "be";

type PartLeaderCandidate = {
  id: string;
  apiCandidateId?: number;
  team: string;
  name: string;
  imageUrl: string;
};

type VoteCardItem = {
  label: string;
  iconSrc: string;
};

type RankedVoteItem = {
  id: string;
  name: string;
};

type VoteAction =
  | "partLoad"
  | "partSubmit"
  | "partResult"
  | "demoLoad"
  | "demoSubmit"
  | "demoResult";

type DemoDayTeam = {
  id: string;
  name: string;
  apiTeam: UserTeam;
  description: string;
};

const voteEntryItems = [
  {
    label: "파트장 투표 바로가기",
    iconSrc: "/ic_part-vote.svg",
  },
  {
    label: "데모데이 투표 바로가기",
    iconSrc: "/ic_demo-vote.svg",
  },
];

const partLeaderVoteItems: Array<VoteCardItem & { id: PartLeaderPart }> = [
  {
    id: "fe",
    label: "FE 파트장 투표",
    iconSrc: "/ic_part-vote.svg",
  },
  {
    id: "be",
    label: "BE 파트장 투표",
    iconSrc: "/ic_part-vote.svg",
  },
];

const partLeaderLabels: Record<PartLeaderPart, string> = {
  fe: "FE",
  be: "BE",
};

const partLeaderProfilePartNames: Record<PartLeaderPart, string> = {
  fe: "프론트엔드",
  be: "백엔드",
};

const partLeaderApiValues: Record<PartLeaderPart, VotePartApiValue> = {
  fe: "FRONTEND",
  be: "BACKEND",
};

const fePartLeaderCandidates: PartLeaderCandidate[] = [
  {
    id: "kwon-ohjin",
    team: "Ditda",
    name: "권오진",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "gu-mingyo",
    team: "JobDri",
    name: "구민교",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "kim-minseo",
    team: "IPX",
    name: "김민서",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "kim-hongyeop",
    team: "CONX",
    name: "김홍엽",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "nam-girim",
    team: "IPX",
    name: "남기림",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "park-yumin",
    team: "Ditda",
    name: "박유민",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "oh-yujin",
    team: "CONX",
    name: "오유진",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "lee-seungyeon",
    team: "Groupeat",
    name: "이승연",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "lee-yunseo",
    team: "Groupeat",
    name: "이윤서",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "hwang-youngjun",
    team: "Groupeat",
    name: "황영준",
    imageUrl: "/profile1.jpg",
  },
];

const bePartLeaderCandidates: PartLeaderCandidate[] = [
  {
    id: "hwang-shinae",
    team: "JobDri",
    name: "황신애",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "choi-seungwon",
    team: "JobDri",
    name: "최승원",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "kim-dongwook",
    team: "IPX",
    name: "김동욱",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "lim-jonghoon",
    team: "CONX",
    name: "임종훈",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "kim-taehee",
    team: "IPX",
    name: "김태희",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "choi-woohyuk",
    team: "JobDri",
    name: "최우혁",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "ahn-junseok",
    team: "CONX",
    name: "안준석",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "kim-dohyun",
    team: "Groupeat",
    name: "김도현",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "kim-taeik",
    team: "Groupeat",
    name: "김태익",
    imageUrl: "/profile1.jpg",
  },
  {
    id: "oh-jisong",
    team: "Groupeat",
    name: "오지송",
    imageUrl: "/profile1.jpg",
  },
];

const partLeaderCandidates: Record<PartLeaderPart, PartLeaderCandidate[]> = {
  fe: fePartLeaderCandidates,
  be: bePartLeaderCandidates,
};

const feProfileDescription =
  "더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트더미텍스트";

const demoDayTeams: DemoDayTeam[] = [
  {
    id: "conx",
    name: "CONX",
    apiTeam: "CONX",
    description: "어쩌구저쩌구\n서비스",
  },
  {
    id: "ditda",
    name: "Ditda",
    apiTeam: "DITDA",
    description: "어쩌구저쩌구\n서비스",
  },
  {
    id: "groupeat",
    name: "Groupeat",
    apiTeam: "GROUPEAT",
    description: "어쩌구저쩌구\n서비스",
  },
  {
    id: "ipx",
    name: "IPX",
    apiTeam: "IPX",
    description: "어쩌구저쩌구\n서비스",
  },
  {
    id: "jobdri",
    name: "Jobdri",
    apiTeam: "JOBDRI",
    description: "어쩌구저쩌구\n서비스",
  },
];

const createInitialPartLeaderResults = (candidates: PartLeaderCandidate[]) =>
  candidates.reduce<Record<string, number>>((results, candidate) => {
  results[candidate.id] = 0;
  return results;
}, {});

const initialPartLeaderResults: Record<PartLeaderPart, Record<string, number>> =
  {
    fe: createInitialPartLeaderResults(fePartLeaderCandidates),
    be: createInitialPartLeaderResults(bePartLeaderCandidates),
  };

const initialDemoDayResults = demoDayTeams.reduce<Record<string, number>>(
  (results, team) => {
    results[team.id] = 0;
    return results;
  },
  {},
);

const initialPartLeaderCandidateApiIds: Record<
  PartLeaderPart,
  Record<string, number>
> = {
  fe: {},
  be: {},
};

function normalizeVoteKey(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function mapPartLeaderApiResults(
  part: PartLeaderPart,
  apiResults: PartVoteResultResponse[],
) {
  const localCandidateByName = new Map(
    partLeaderCandidates[part].map((candidate) => [
      normalizeVoteKey(candidate.name),
      candidate,
    ]),
  );

  if (apiResults.length === 0) {
    return {
      candidates: partLeaderCandidates[part],
      results: createInitialPartLeaderResults(partLeaderCandidates[part]),
      candidateApiIds: {} as Record<string, number>,
    };
  }

  return apiResults.reduce(
    (mappedResults, apiResult) => {
      const localCandidate = localCandidateByName.get(
        normalizeVoteKey(apiResult.name),
      );
      const candidate = {
        id: localCandidate?.id ?? `api-${apiResult.candidateId}`,
        apiCandidateId: apiResult.candidateId,
        team: localCandidate?.team ?? partLeaderLabels[part],
        name: apiResult.name,
        imageUrl: localCandidate?.imageUrl ?? "/profile1.jpg",
      };

      mappedResults.candidates.push(candidate);
      mappedResults.results[candidate.id] = apiResult.voteCount ?? 0;
      mappedResults.candidateApiIds[candidate.id] = apiResult.candidateId;

      return mappedResults;
    },
    {
      candidates: [] as PartLeaderCandidate[],
      results: {} as Record<string, number>,
      candidateApiIds: {} as Record<string, number>,
    },
  );
}

function mapTeamApiResults(apiResults: TeamVoteResultResponse[]) {
  const apiResultByTeam = new Map(
    apiResults.map((result) => [normalizeVoteKey(result.team), result]),
  );

  return demoDayTeams.reduce<Record<string, number>>((results, team) => {
    const apiResult =
      apiResultByTeam.get(normalizeVoteKey(team.apiTeam)) ??
      apiResultByTeam.get(normalizeVoteKey(team.name));

    results[team.id] = apiResult?.voteCount ?? 0;
    return results;
  }, {});
}

function getVoteErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "투표 처리 중 오류가 발생했습니다.";
}

function getVoteUserMessage(error: unknown, fallbackMessage: string) {
  const message = getVoteErrorMessage(error)
    .replace(/^(GET|POST) \/api\/votes\/(?:team|part)(?:\?[^ ]*)? 실패: \d+\s*/u, "")
    .trim();

  return message || fallbackMessage;
}

type VoteView =
  | "entry"
  | "partLeader"
  | "partLeaderVote"
  | "partLeaderResult"
  | "partLeaderProfile"
  | "demoDayVote"
  | "demoDayResult";

function VoteCard({
  item,
  onClick,
}: {
  item: VoteCardItem;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="vote-entry-icon" aria-hidden="true">
        <Image src={item.iconSrc} alt="" width={24} height={24} />
      </span>

      <span className="vote-entry-label">{item.label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="vote-entry-card" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <article className="vote-entry-card">{content}</article>;
}

export default function VoteClient() {
  const [view, setView] = useState<VoteView>("entry");
  const [activePart, setActivePart] = useState<PartLeaderPart>("fe");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [partLeaderCandidateLists, setPartLeaderCandidateLists] = useState(
    partLeaderCandidates,
  );
  const [partLeaderResults, setPartLeaderResults] = useState(
    initialPartLeaderResults,
  );
  const [partLeaderCandidateApiIds, setPartLeaderCandidateApiIds] = useState(
    initialPartLeaderCandidateApiIds,
  );
  const [demoDayResults, setDemoDayResults] = useState(initialDemoDayResults);
  const [pendingAction, setPendingAction] = useState<VoteAction | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [currentUserTeam] = useState<UserTeam | null>(
    () => getAuthUser()?.team ?? null,
  );
  const activePartLabel = partLeaderLabels[activePart];
  const activeCandidates = partLeaderCandidateLists[activePart];
  const title =
    view === "demoDayResult"
      ? "데모데이 투표 결과"
      : view === "partLeaderResult"
      ? `${activePartLabel} 파트장 투표 결과`
      : view === "partLeaderVote"
      ? `${activePartLabel} 파트장 투표`
      : view === "demoDayVote"
      ? "데모데이 투표"
      : view === "partLeader"
        ? "파트장 투표"
      : "투표하기";
  const isPartLeaderFlow =
    view === "partLeaderVote" || view === "partLeaderResult";
  const isWideVoteFlow =
    isPartLeaderFlow || view === "demoDayVote" || view === "demoDayResult";
  const isProfileView = view === "partLeaderProfile";
  const isVoteContentView =
    view === "partLeaderVote" ||
    view === "partLeaderResult" ||
    view === "demoDayVote" ||
    view === "demoDayResult";
  const isPartBusy = pendingAction?.startsWith("part") ?? false;
  const isDemoBusy = pendingAction?.startsWith("demo") ?? false;
  const selectedProfile =
    activeCandidates.find((candidate) => candidate.id === selectedProfileId) ??
    activeCandidates[0];

  const logVoteWarning = (message: string) => {
    console.warn(`[vote] ${message}`);
  };

  const getPartLeaderApiResults = async (part: PartLeaderPart) => {
    const apiPart = partLeaderApiValues[part];
    return getPartVoteResults(apiPart);
  };

  const syncPartLeaderResults = async (part: PartLeaderPart) => {
    const apiResults = await getPartLeaderApiResults(part);
    const mappedResults = mapPartLeaderApiResults(part, apiResults);

    setPartLeaderCandidateLists((currentCandidates) => ({
      ...currentCandidates,
      [part]: mappedResults.candidates,
    }));
    setPartLeaderResults((currentResults) => ({
      ...currentResults,
      [part]: mappedResults.results,
    }));
    setPartLeaderCandidateApiIds((currentApiIds) => ({
      ...currentApiIds,
      [part]: mappedResults.candidateApiIds,
    }));

    return mappedResults;
  };

  const syncDemoDayResults = async () => {
    const apiResults = await getTeamVoteResults();
    const mappedResults = mapTeamApiResults(apiResults);

    setDemoDayResults(mappedResults);
    return mappedResults;
  };

  const openPartLeaderVote = (part: PartLeaderPart) => {
    setActivePart(part);
    setSelectedProfileId(null);
    setVoteError(null);
    setView("partLeaderVote");
    setPendingAction("partLoad");
    void syncPartLeaderResults(part).catch((error) => {
      setVoteError(
        getVoteUserMessage(error, "파트장 후보 정보를 불러오지 못했습니다."),
      );
      logVoteWarning(
        `파트장 후보 동기화 실패: ${getVoteErrorMessage(error)}`,
      );
    }).finally(() => {
      setPendingAction((currentAction) =>
        currentAction === "partLoad" ? null : currentAction,
      );
    });
  };

  const openDemoDayVote = () => {
    setVoteError(null);
    setView("demoDayVote");
    setPendingAction("demoLoad");
    void syncDemoDayResults().catch((error) => {
      setVoteError(
        getVoteUserMessage(error, "데모데이 결과를 불러오지 못했습니다."),
      );
      logVoteWarning(
        `데모데이 결과 동기화 실패: ${getVoteErrorMessage(error)}`,
      );
    }).finally(() => {
      setPendingAction((currentAction) =>
        currentAction === "demoLoad" ? null : currentAction,
      );
    });
  };

  const handleSubmitVote = async (candidateId: string) => {
    if (pendingAction) {
      return;
    }

    if (!getToken()) {
      setVoteError("로그인 후 투표할 수 있습니다.");
      return;
    }

    const part = activePart;
    setVoteError(null);
    setPendingAction("partSubmit");

    try {
      let apiCandidateId = partLeaderCandidateApiIds[part][candidateId];

      if (apiCandidateId === undefined) {
        const mappedResults = await syncPartLeaderResults(part);
        apiCandidateId = mappedResults.candidateApiIds[candidateId];
      }

      if (apiCandidateId === undefined) {
        throw new Error(
          "아직 서버에 등록된 후보가 아닙니다. 관리자 후보 등록 후 다시 시도해 주세요.",
        );
      }

      await submitPartVote(apiCandidateId);
      await syncPartLeaderResults(part);
      setView("partLeaderResult");
    } catch (error) {
      setVoteError(
        getVoteUserMessage(error, "파트장 투표에 실패했습니다."),
      );
      logVoteWarning(`파트장 투표 실패: ${getVoteErrorMessage(error)}`);
    } finally {
      setPendingAction((currentAction) =>
        currentAction === "partSubmit" ? null : currentAction,
      );
    }
  };

  const handleShowPartLeaderResult = async () => {
    if (pendingAction) {
      return;
    }

    setVoteError(null);
    setPendingAction("partResult");

    try {
      await syncPartLeaderResults(activePart);
      setView("partLeaderResult");
    } catch (error) {
      setVoteError(
        getVoteUserMessage(error, "파트장 투표 결과를 불러오지 못했습니다."),
      );
      logVoteWarning(
        `파트장 결과 동기화 실패: ${getVoteErrorMessage(error)}`,
      );
    } finally {
      setPendingAction((currentAction) =>
        currentAction === "partResult" ? null : currentAction,
      );
    }
  };

  const handleSubmitDemoVote = async (teamId: string) => {
    if (pendingAction) {
      return;
    }

    if (!getToken()) {
      setVoteError("로그인 후 투표할 수 있습니다.");
      return;
    }

    const selectedTeam = demoDayTeams.find((team) => team.id === teamId);

    if (!selectedTeam) {
      return;
    }

    setVoteError(null);
    setPendingAction("demoSubmit");

    try {
      await submitTeamVote(selectedTeam.apiTeam);
      await syncDemoDayResults();
      setView("demoDayResult");
    } catch (error) {
      setVoteError(
        getVoteUserMessage(error, "데모데이 투표에 실패했습니다."),
      );
      logVoteWarning(
        `데모데이 투표 실패: ${getVoteErrorMessage(error)}`,
      );
    } finally {
      setPendingAction((currentAction) =>
        currentAction === "demoSubmit" ? null : currentAction,
      );
    }
  };

  const handleShowDemoDayResult = async () => {
    if (pendingAction) {
      return;
    }

    setVoteError(null);
    setPendingAction("demoResult");

    try {
      await syncDemoDayResults();
      setView("demoDayResult");
    } catch (error) {
      setVoteError(
        getVoteUserMessage(error, "데모데이 투표 결과를 불러오지 못했습니다."),
      );
      logVoteWarning(
        `데모데이 결과 동기화 실패: ${getVoteErrorMessage(error)}`,
      );
    } finally {
      setPendingAction((currentAction) =>
        currentAction === "demoResult" ? null : currentAction,
      );
    }
  };

  return (
    <div className="app-page">
      <div className="app-container app-page-stack">
        <AppHeader />

        <main
          className={`vote-main ${
            isWideVoteFlow ? "vote-main-fe" : ""
          } ${isProfileView ? "vote-main-profile" : ""} ${
            view === "partLeader" ? "vote-main-part-select" : ""
          } ${view === "entry" ? "vote-main-entry" : ""} ${
            isVoteContentView ? "vote-main-choice" : ""
          }`}
          aria-label={isProfileView ? `${activePartLabel} 프로필 보기` : undefined}
          aria-labelledby={isProfileView ? undefined : "vote-main-title"}
        >
          {!isProfileView && (
            <h1 id="vote-main-title" className="vote-main-title">
              {title}
            </h1>
          )}

          {voteError && !isProfileView && (
            <p className="vote-status-message" role="alert">
              {voteError}
            </p>
          )}

          {isProfileView ? (
            <PartLeaderProfileView
              part={activePart}
              candidate={selectedProfile}
              onClose={() => setView("partLeaderVote")}
            />
          ) : view === "partLeaderResult" ? (
            <PartLeaderResult
              part={activePart}
              candidates={activeCandidates}
              results={partLeaderResults[activePart]}
              onBack={() => setView("partLeaderVote")}
            />
          ) : view === "partLeaderVote" ? (
            <PartLeaderVote
              part={activePart}
              candidates={activeCandidates}
              onSubmitVote={handleSubmitVote}
              onShowResult={handleShowPartLeaderResult}
              onShowProfile={(candidateId) => {
                setSelectedProfileId(candidateId);
                setView("partLeaderProfile");
              }}
              isBusy={isPartBusy}
            />
          ) : view === "demoDayVote" ? (
            <DemoDayVote
              onSubmitVote={handleSubmitDemoVote}
              onShowResult={handleShowDemoDayResult}
              isBusy={isDemoBusy}
              currentUserTeam={currentUserTeam}
            />
          ) : view === "demoDayResult" ? (
            <VoteResultRanking
              items={demoDayTeams}
              results={demoDayResults}
              ariaLabel="데모데이 투표 결과 순위"
              className="demo-result-panel"
              singleColumn
              onBack={() => setView("demoDayVote")}
            />
          ) : (
            <section className="vote-entry-list" aria-label={title}>
              {view === "partLeader"
                ? partLeaderVoteItems.map((item) => (
                    <VoteCard
                      key={item.label}
                      item={item}
                      onClick={() => openPartLeaderVote(item.id)}
                    />
                  ))
                : voteEntryItems.map((item, index) => (
                    <VoteCard
                      key={item.label}
                      item={item}
                      onClick={
                        index === 0
                          ? () => setView("partLeader")
                          : openDemoDayVote
                      }
                    />
                  ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function PartLeaderVote({
  part,
  candidates,
  onSubmitVote,
  onShowResult,
  onShowProfile,
  isBusy,
}: {
  part: PartLeaderPart;
  candidates: PartLeaderCandidate[];
  onSubmitVote: (candidateId: string) => void | Promise<void>;
  onShowResult: () => void | Promise<void>;
  onShowProfile: (candidateId: string) => void;
  isBusy: boolean;
}) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );

  return (
    <section
      className="fe-part-vote-panel"
      aria-label={`${partLeaderLabels[part]} 파트장 후보`}
    >
      <div className="fe-candidate-grid">
        {candidates.map((candidate) => {
          const isSelected = selectedCandidateId === candidate.id;

          return (
            <article
              key={candidate.id}
              className={`fe-candidate-card ${
                isSelected ? "fe-candidate-card-selected" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => setSelectedCandidateId(candidate.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedCandidateId(candidate.id);
                }
              }}
            >
              <div className="fe-candidate-card-content">
                <div className="fe-candidate-copy">
                  <span className="fe-candidate-team">{candidate.team}</span>
                  <h2 className="fe-candidate-name">{candidate.name}</h2>
                </div>

                <Button
                  label="프로필 보기"
                  styleType="secondary"
                  size="large"
                  className="fe-profile-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onShowProfile(candidate.id);
                  }}
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="fe-vote-actions">
        <Button
          label="투표하기"
          size="large"
          className="fe-action-button fe-action-button-primary"
          disabled={!selectedCandidateId || isBusy}
          onClick={() => {
            if (!selectedCandidateId) {
              return;
            }

            onSubmitVote(selectedCandidateId);
          }}
        />
        <Button
          label="결과보기"
          size="large"
          className="fe-action-button fe-action-button-result"
          disabled={isBusy}
          onClick={onShowResult}
        />
      </div>
    </section>
  );
}

function DemoDayVote({
  onSubmitVote,
  onShowResult,
  isBusy,
  currentUserTeam,
}: {
  onSubmitVote: (teamId: string) => void | Promise<void>;
  onShowResult: () => void | Promise<void>;
  isBusy: boolean;
  currentUserTeam: UserTeam | null;
}) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const teamRows = [demoDayTeams.slice(0, 3), demoDayTeams.slice(3, 5)];
  const selectedTeam = selectedTeamId
    ? demoDayTeams.find((team) => team.id === selectedTeamId)
    : null;
  const isSelectedOwnTeam = selectedTeam?.apiTeam === currentUserTeam;
  const effectiveSelectedTeamId = isSelectedOwnTeam ? null : selectedTeamId;

  return (
    <section className="demo-vote-panel" aria-label="데모데이 후보 팀">
      <div className="demo-team-list">
        {teamRows.map((row, rowIndex) => (
          <div key={rowIndex} className="demo-team-row">
            {row.map((team) => {
              const isSelected = effectiveSelectedTeamId === team.id;
              const isOwnTeam = team.apiTeam === currentUserTeam;

              return (
                <article
                  key={team.id}
                  className={`demo-team-card ${
                    isSelected ? "demo-team-card-selected" : ""
                  } ${isOwnTeam ? "demo-team-card-disabled" : ""}`}
                  role={isOwnTeam ? undefined : "button"}
                  tabIndex={isOwnTeam ? -1 : 0}
                  aria-disabled={isOwnTeam || undefined}
                  aria-pressed={isOwnTeam ? undefined : isSelected}
                  onClick={() => {
                    if (isOwnTeam) {
                      return;
                    }

                    setSelectedTeamId(team.id);
                  }}
                  onKeyDown={(event) => {
                    if (isOwnTeam) {
                      return;
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedTeamId(team.id);
                    }
                  }}
                >
                  <div className="demo-team-card-content">
                    <div className="demo-team-copy">
                      <h2 className="demo-team-name">{team.name}</h2>
                      <p className="demo-team-description">
                        {team.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>

      <div className="fe-vote-actions">
        <Button
          label="투표하기"
          size="large"
          className="fe-action-button fe-action-button-primary"
          disabled={!selectedTeamId || isSelectedOwnTeam || isBusy}
          onClick={() => {
            if (!selectedTeamId || isSelectedOwnTeam) {
              return;
            }

            onSubmitVote(selectedTeamId);
          }}
        />
        <Button
          label="결과보기"
          size="large"
          className="fe-action-button fe-action-button-result"
          disabled={isBusy}
          onClick={onShowResult}
        />
      </div>
    </section>
  );
}

function PartLeaderProfileView({
  part,
  candidate,
  onClose,
}: {
  part: PartLeaderPart;
  candidate: PartLeaderCandidate;
  onClose: () => void;
}) {
  return (
    <section className="profile-card fe-profile-card card-surface rounded-20">
      <div className="profile-close-slot">
        <IconOnlyButton onClick={onClose} />
      </div>

      <div className="profile-top">
        <div className="profile-media-info fe-profile-media-info">
          <div className="profile-image-frame">
            <Image
              src={candidate.imageUrl}
              alt={`${candidate.name} 프로필`}
              width={636}
              height={482}
              quality={100}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="profile-info fe-profile-info">
            <h2 className="text-h24-bold text-gray-9 [font-feature-settings:'liga'_off,'clig'_off]">
              {candidate.name}
            </h2>

            <div className="flex flex-col items-start gap-[5px]">
              <FeProfileField label="팀:" value={candidate.team} />
              <FeProfileField
                label="파트:"
                value={partLeaderProfilePartNames[part]}
              />
              <FeProfileField label="기수:" value="23기" />
            </div>
          </div>
        </div>
      </div>

      <div className="profile-detail fe-profile-detail">
        <h3 className="text-t20-semibold mobile-text-b16-semibold text-gray-9 [font-feature-settings:'liga'_off,'clig'_off]">
          상세 정보:
        </h3>
        <p className="self-stretch text-t20-reg-loose mobile-text-b16-med text-gray-9 [font-feature-settings:'liga'_off,'clig'_off]">
          {feProfileDescription}
        </p>
      </div>
    </section>
  );
}

function FeProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="fe-profile-field">
      <span className="fe-profile-field-label">{label}</span>
      <span className="fe-profile-field-value">{value}</span>
    </div>
  );
}

function PartLeaderResult({
  part,
  candidates,
  results,
  onBack,
}: {
  part: PartLeaderPart;
  candidates: PartLeaderCandidate[];
  results: Record<string, number>;
  onBack: () => void;
}) {
  return (
    <VoteResultRanking
      items={candidates}
      results={results}
      ariaLabel={`${partLeaderLabels[part]} 파트장 투표 결과 순위`}
      onBack={onBack}
    />
  );
}

function VoteResultRanking({
  items,
  results,
  ariaLabel,
  className = "",
  singleColumn = false,
  onBack,
}: {
  items: RankedVoteItem[];
  results: Record<string, number>;
  ariaLabel: string;
  className?: string;
  singleColumn?: boolean;
  onBack: () => void;
}) {
  const ranking = [...items]
    .map((candidate) => ({
      ...candidate,
      count: results[candidate.id] ?? 0,
    }))
    .sort((firstCandidate, secondCandidate) => {
      return secondCandidate.count - firstCandidate.count;
    });
  const rankingColumns = singleColumn
    ? [ranking]
    : [ranking.slice(0, 5), ranking.slice(5, 10)];

  return (
    <section
      className={`fe-result-panel ${className}`}
      aria-label={ariaLabel}
    >
      <div className="fe-result-ranking">
        {rankingColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="fe-result-column">
            {column.map((candidate, index) => {
              const rank = columnIndex * 5 + index + 1;
              const isFirstPlace = rank === 1;

              return (
                <article key={candidate.id} className="fe-result-row">
                  <div
                    className={`fe-result-rank ${
                      isFirstPlace ? "fe-result-rank-first" : ""
                    }`}
                  >
                    {isFirstPlace && (
                      <svg
                        className="fe-result-crown"
                        viewBox="0 0 40 34"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7.5 27.5L4.5 10.5L14.5 17.5L20.5 5L26.5 17.5L36 10.5L33 27.5H7.5Z"
                          fill="#FFD84D"
                          stroke="#6B2A00"
                          strokeWidth="2.6"
                          strokeLinejoin="round"
                        />
                        <circle cx="4.5" cy="10.5" r="2.4" fill="#FFD84D" stroke="#6B2A00" strokeWidth="2" />
                        <circle cx="20.5" cy="5" r="2.4" fill="#FFD84D" stroke="#6B2A00" strokeWidth="2" />
                        <circle cx="36" cy="10.5" r="2.4" fill="#FFD84D" stroke="#6B2A00" strokeWidth="2" />
                      </svg>
                    )}
                    <span>{rank}</span>
                  </div>

                  <div
                    className={`fe-result-card ${
                      isFirstPlace ? "fe-result-card-first" : ""
                    }`}
                  >
                    <div className="fe-result-card-content">
                      <span className="fe-result-name">{candidate.name}</span>
                      <span className="fe-result-count">
                        {candidate.count}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>

      <Button
        label="돌아가기"
        size="large"
        className="fe-action-button fe-action-button-primary fe-result-back-button"
        onClick={onBack}
      />
    </section>
  );
}
