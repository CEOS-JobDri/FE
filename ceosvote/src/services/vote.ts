import { getToken } from "@/utils/auth";

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
    response = await fetch(path, {
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
      getVoteApiDefaultErrorMessage(path, options.method, response.status) ??
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

function getVoteApiDefaultErrorMessage(
  path: string,
  method = "GET",
  status: number,
) {
  if (status === 401 || status === 403) {
    if (method === "POST" && path === "/api/votes/team") {
      return "로그인이 만료되었거나 본인 팀에는 투표할 수 없습니다.";
    }

    if (method === "POST" && path === "/api/votes/part") {
      return "로그인이 만료되었거나 본인 파트 후보에게만 투표할 수 있습니다.";
    }

    return "로그인이 만료되었거나 접근 권한이 없습니다.";
  }

  return null;
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

export async function submitPartVote(candidateId: number) {
  return fetchVoteApi<string>("/api/votes/part", {
    method: "POST",
    body: JSON.stringify({ candidateId }),
  });
}
