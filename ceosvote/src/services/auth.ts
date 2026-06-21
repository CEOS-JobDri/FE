import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  Candidate,
  CreateCandidateReq,
} from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `${res.status} 오류가 발생했습니다.`);
  }

  const text = await res.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

// 🔐 로그인은 토큰(AuthResponse)을 받아옵니다.
export async function login(data: LoginRequest): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/api/auth/login", data);
}

// 📝 회원가입은 <T>를 지우고, 받을 데이터가 없다는 뜻인 <void>로 쾅 박아둡니다!
export async function signup(data: SignupRequest): Promise<void> {
  await fetchApi<void>("/api/auth/signup", data);
}

// 💡 공통 Fetch 함수 (토큰 자동 포함)
async function fetchAdminApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // 1️⃣ 브라우저(클라이언트) 환경인지 확인하고 로컬 스토리지에서 토큰 꺼내기
  let token = "";
  if (typeof window !== "undefined") {
    // ⚠️ 로그인 시 저장했던 키 이름('accessToken' 등)과 똑같이 맞춰주세요!
    token = localStorage.getItem("accessToken") || "";
  }

  // 2️⃣ 헤더에 토큰 달아주기
  const headers = {
    "Content-Type": "application/json",
    // 토큰이 존재하면 Authorization 헤더에 Bearer 방식으로 추가합니다.
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `${res.status} 오류가 발생했습니다.`);
  }

  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

export async function getCandidates(
  part: "FRONTEND" | "BACKEND",
): Promise<Candidate[]> {
  return fetchAdminApi<Candidate[]>(`/api/admin/candidates?part=${part}`, {
    method: "GET",
  });
}

export async function createCandidate(data: CreateCandidateReq): Promise<void> {
  return fetchAdminApi<void>("/api/admin/candidates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCandidate(id: number): Promise<void> {
  return fetchAdminApi<void>(`/api/admin/candidates?candidateId=${id}`, {
    method: "DELETE",
  });
}
