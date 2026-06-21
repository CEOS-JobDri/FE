import type { LoginRequest, SignupRequest, AuthResponse } from "@/types/auth";

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
