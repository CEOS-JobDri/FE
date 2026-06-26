export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface SignupRequest {
  loginId: string;
  password: string;
  email: string;
  name: string;
  part: UserPart;
  team: UserTeam;
}

export type UserPart = "FRONTEND" | "BACKEND";
export type UserTeam = "JOBDRI" | "IPX" | "GROUPEAT" | "CONX" | "DITDA";

export interface UserSummary {
  id: number;
  loginId: string;
  name: string;
  part: UserPart;
  team: UserTeam;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  user?: UserSummary;
}

// export interface EmailVerificationSendRequest {
//   email: string;
// }

// export interface EmailVerificationVerifyRequest {
//   email: string;
//   code: string;
// }

// export interface EmailVerificationVerifyResponse {
//   emailVerificationToken: string;
// }
