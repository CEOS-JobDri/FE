// @/services/auth.ts
import {
  type LoginRequest,
  type SignupRequest,
  type AuthResponse,
  type Candidate,
  type CreateCandidateReq,
} from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ✅ 회원가입 기능 복구
export async function signup(data: SignupRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("회원가입 실패");
}

// ✅ 로그인 기능 복구
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("로그인 실패");
  return res.json();
}

// ✅ 로그아웃 기능 복구
export async function logout(): Promise<void> {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
}

// ✅ 후보자 목록 가져오기 (인증 헤더 포함)
async function fetchAdminApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`${res.status} 오류 발생`);
  return res.json();
}

export async function getCandidates(
  part: "FRONTEND" | "BACKEND",
): Promise<Candidate[]> {
  return fetchAdminApi<Candidate[]>(`/api/admin/candidates?part=${part}`);
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
