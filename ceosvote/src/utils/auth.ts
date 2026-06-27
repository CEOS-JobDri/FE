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
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): UserSummary | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedUser = localStorage.getItem(USER_KEY);

  if (savedUser) {
    try {
      return JSON.parse(savedUser) as UserSummary;
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  }

  return getUserFromToken();
}

function getUserFromToken(): UserSummary | null {
  const token = getToken();

  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );
    const decodedPayload = JSON.parse(
      atob(paddedPayload),
    ) as Partial<UserSummary> & {
      user?: Partial<UserSummary>;
    };
    const user = decodedPayload.user ?? decodedPayload;

    if (!user.team || !user.part || !user.name) {
      return null;
    }

    return {
      id: Number(user.id ?? 0),
      loginId: String(user.loginId ?? ""),
      name: String(user.name),
      part: user.part,
      team: user.team,
    } as UserSummary;
  } catch {
    return null;
  }
}
