import { getToken } from "@/utils/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type VotePartApiValue = "FRONTEND" | "BACKEND";

export interface TeamVoteResultResponse {
  team: string;
  voteCount: number;
}

export interface PartVoteResultResponse {
  candidateId: number;
  name: string;
  voteCount: number;
}

async function fetchVoteApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new Error("백엔드 서버에 연결할 수 없습니다.");
  }

  const text = await response.text();

  if (!response.ok) {
    const error = text
      ? safeParseJson<{ message?: string; error?: string }>(text)
      : null;
    const isProxyConnectionError =
      response.status === 500 && text.trim() === "Internal Server Error";
    const responseMessage =
      (isProxyConnectionError ? "백엔드 서버에 연결할 수 없습니다." : null) ??
      error?.message ??
      error?.error ??
      (text && !text.startsWith("<") ? text : null) ??
      `${response.status} 오류가 발생했습니다.`;

    throw new Error(
      `${options.method ?? "GET"} ${path} 실패: ${response.status} ${responseMessage}`,
    );
  }

  if (!text) {
    return undefined as T;
  }

  return safeParseJson<T>(text) ?? (text as T);
}

function safeParseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function getTeamVoteResults() {
  return fetchVoteApi<TeamVoteResultResponse[]>("/api/votes/team");
}

export async function submitTeamVote(team: string) {
  return fetchVoteApi<string>("/api/votes/team", {
    method: "POST",
    body: JSON.stringify({ team }),
  });
}

export async function getPartVoteResults(part: VotePartApiValue) {
  return fetchVoteApi<PartVoteResultResponse[]>(
    `/api/votes/part?part=${encodeURIComponent(part)}`,
  );
}

export async function getAdminPartCandidates(part: VotePartApiValue) {
  return fetchVoteApi<PartVoteResultResponse[]>(
    `/api/admin/candidates?part=${encodeURIComponent(part)}`,
  );
}

export async function submitPartVote(candidateId: number) {
  return fetchVoteApi<string>("/api/votes/part", {
    method: "POST",
    body: JSON.stringify({ candidateId }),
  });
}
