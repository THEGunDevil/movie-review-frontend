import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";

export interface User {
  id: string;
  user_name: string;
  email: string;
  password_hash: string;

  role: "user" | "admin";

  created_at: string;
  updated_at: string;

  token_version: number;

  is_banned: boolean;
  will_profit: boolean;

  ban_reason: string | null;
  ban_until: string | null;
  is_permanent_ban: boolean;
}

export interface ErrorResponse {
  message?: string;
}

export interface UseUserDataProps {
  userID: string | null;
  accessToken: string | null;
}

export interface JwtPayload {
  sub: string;
  role: string;
  token_version: number;

  is_banned: boolean;
  is_permanent_ban: boolean;
  ban_reason?: string;
  ban_until?: string;

  exp: number;
  iat: number;
}
export interface AuthContextType {
  accessToken: string | null;
  userID: string | null;
  user: User | null;
  userInfo: User | null;
  loading: boolean;
  error: string | null;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
  isBanned: boolean;
  banReason: string | null;
  banUntil?: string | null;
  isPermanentBan: boolean;
}
export interface AuthProviderProps {
  children: ReactNode;
}
// lib/jwt.ts (নতুন ফাইল)

interface TokenPayload {
  exp: number;
  iat: number;
  is_banned?: boolean;
  is_permanent_ban?: boolean;
  role: string;
  sub: string;
}

export function decodeAccessToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}
export interface SignUpData {
  user_name: string;
  email: string;
  password: string;
  confirm_password: string;
}
export interface SignInData {
  email: string;
  password: string;
}
