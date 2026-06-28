export type PartLeaderPart = "FRONTEND" | "BACKEND";

export interface PartLeaderCandidate {
  candidateId: number;
  name: string;
  voteCount: number; // API 응답에 맞춰 명시적 정의
  // team 필드가 필요하다면 추가
  team?: string;
}
