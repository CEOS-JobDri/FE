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
