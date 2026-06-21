export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface SignupRequest {
  loginId: string;
  password: string;
  email: string;
  name: string;
  part: "FRONTEND" | "BACKEND";
  team: "JOBDRI" | "IPX" | "GROUPEAT" | "CONX" | "DITDA";
}

export interface AuthResponse {
  accessToken: string;
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

// src/services/admin.ts

// 💡 타입 정의 (백엔드 스펙에 맞춰 수정해주세요)
export interface Candidate {
  id: number;
  name: string;
  part: "FRONTEND" | "BACKEND";
  team: string;
}

export interface CreateCandidateReq {
  name: string;
  part: "FRONTEND" | "BACKEND";
  team: string;
}
