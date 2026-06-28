import type { UserSummary } from "@/types/auth";

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}`;
}

export function saveAuthUser(user: UserSummary) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): UserSummary | null {
  if (typeof window === "undefined") {
    return null;
  }

  // 1. 토큰에서 권한(role)이 포함된 유저 정보를 먼저 파싱합니다.
  const tokenUser = getUserFromToken();

  const savedUser = localStorage.getItem(USER_KEY);

  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser) as UserSummary;

      // 2. ✨ 핵심: localStorage 정보에 토큰에서 빼온 role을 강제로 합쳐서 리턴합니다!
      return {
        ...parsedUser,
        role: tokenUser?.role ?? "USER",
      };
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  }

  // localStorage에 아무것도 없으면 토큰 파싱 결과만 리턴합니다.
  return tokenUser;
}

// Payload에 들어있는 실제 데이터 타입을 정의해 줍니다.
interface JwtPayload {
  role?: string;
  sub?: string;
  userId?: number;
  name?: string;
  exp?: number;
  iat?: number;
  team?: string;
  part?: string;
}

function getUserFromToken(): UserSummary | null {
  const token = getToken();

  if (!token) {
    return null;
  }

  const parts = token.split(".");
  // JWT는 항상 Header.Payload.Signature 3부분으로 나뉘어야 합니다.
  if (parts.length !== 3) {
    return null;
  }

  const payload = parts[1];

  try {
    // Base64URL 디코딩 및 패딩 처리
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );

    // 페이로드 파싱
    const decodedPayload = JSON.parse(atob(paddedPayload)) as JwtPayload;

    // 실제 토큰에 있는 데이터를 기반으로 UserSummary 객체 생성
    return {
      id: Number(decodedPayload.userId ?? 0),
      // 토큰의 'sub' 필드가 loginId 역할을 하고 있으므로 매핑해 줍니다.
      loginId: String(decodedPayload.sub ?? ""),
      name: String(decodedPayload.name ?? ""),

      // 토큰에 없는 team과 part는 에러를 내지 않고 빈 문자열로 처리하거나,
      // 백엔드에 요청하여 토큰에도 넣어달라고 하는 것이 좋습니다.
      part: String(decodedPayload.part ?? ""),
      team: String(decodedPayload.team ?? ""),

      // ✨ 핵심: 권한(role) 값 추가 (기본값은 일반 유저)
      role: String(decodedPayload.role ?? "USER"),
    } as UserSummary;
  } catch (error) {
    // 파싱 중 에러(잘못된 형식의 토큰 등)가 발생하면 조용히 null 반환
    return null;
  }
}
