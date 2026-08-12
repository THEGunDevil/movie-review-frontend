"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useUserData } from "@/hooks/userUserData";
import { AuthContextType, JwtPayload, User } from "@/models/user";

const AuthContext = createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = "authUser";

// ---------- localStorage helpers (unchanged) ----------
function readCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (err) {
    console.error("Failed to read cached user", err);
    return null;
  }
}

function persistUser(data: User) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to persist user data", err);
  }
}

function clearPersistedUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
}

// ---------- Cookie helper ----------
function setAccessTokenCookie(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) {
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    return;
  }
  document.cookie = `access_token=${token}; path=/; max-age=900; SameSite=Lax`;
}

// ---------- Provider ----------
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Ban state – derived directly from JWT, no API call needed
  const [isBanned, setIsBanned] = useState(false);
  const [isPermanentBan, setIsPermanentBan] = useState(false);
  const [banReason, setBanReason] = useState<string | null>(null);
  const [banUntil, setBanUntil] = useState<string | null>(null);
  const login = (token: string) => {
    setAccessToken(token);
    setAccessTokenCookie(token);
  };

  // Hydrate cached profile data on mount (instant name/role)
  useEffect(() => {
    const cached = readCachedUser();
    if (cached) {
      setUser(cached);
      setUserInfo(cached ?? null);
    }
  }, []);

  // Decode token → extract userID + ban status
  useEffect(() => {
    if (!accessToken) {
      setUserID(null);
      setAccessTokenCookie(null);
      setIsBanned(false);
      setIsPermanentBan(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      setUserID(decoded.sub); // <-- এটা নেই
      setIsBanned(!!decoded.is_banned);
      setIsPermanentBan(!!decoded.is_permanent_ban);
      setBanReason(decoded.ban_reason ?? null);
      setBanUntil(decoded.ban_until ?? null);
    } catch (err) {
      console.error("Invalid access token", err);
      setAccessToken(null);
      setUserID(null);
      setAccessTokenCookie(null);
      setIsBanned(false);
      setIsPermanentBan(false);
    }
  }, [accessToken]);

  const refreshToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const token = response.data.access_token;
      setAccessToken(token);
      setAccessTokenCookie(token);
      return token;
    } catch {
      setAccessToken(null);
      setUserID(null);
      setAccessTokenCookie(null);
      return null;
    }
  };

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      setAuthLoading(true);
      await refreshToken();
      setAuthLoading(false);
    };
    initAuth();
  }, []);

  // ✅ Don't call the user-info API if the user is banned
  const shouldFetchUser = !isBanned && !!userID && !!accessToken;
  const {
    data,
    loading: userLoading,
    error,
  } = useUserData(shouldFetchUser ? { userID, accessToken } : null);

  useEffect(() => {
    if (data) {
      setUser(data);
      setUserInfo(data ?? null);
      persistUser(data);
    } else if (!authLoading) {
      setUser(null);
      setUserInfo(null);
      clearPersistedUser();
    }
  }, [data, authLoading]);

  const logout = async () => {
    setAccessToken(null);
    setUserID(null);
    setUser(null);
    setUserInfo(null);
    setIsBanned(false);
    setIsPermanentBan(false);
    setAccessTokenCookie(null);
    clearPersistedUser();

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userID,
        user,
        userInfo,
        loading: authLoading || userLoading,
        error,
        login,
        logout,
        refreshToken,
        isBanned, // ← নতুন
        isPermanentBan, // ← নতুন
        banReason,
        banUntil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
