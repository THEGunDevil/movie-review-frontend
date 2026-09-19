"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
  useSyncExternalStore,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { useUserData } from "@/hooks/userUserData";
import {
  AuthContextType,
  JwtPayload,
  User,
} from "@/models/User";

const AuthContext =
  createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = "authUser";
const AUTH_USER_EVENT = "auth-user-changed";

// ============================================================
// Cached User Store
// ============================================================

function subscribeCachedUser(
  callback: () => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = () => {
    callback();
  };

  const handleCustomEvent = () => {
    callback();
  };

  window.addEventListener(
    "storage",
    handleStorage
  );

  window.addEventListener(
    AUTH_USER_EVENT,
    handleCustomEvent
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorage
    );

    window.removeEventListener(
      AUTH_USER_EVENT,
      handleCustomEvent
    );
  };
}

function getCachedUserSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(
      USER_STORAGE_KEY
    );
  } catch (error) {
    console.error(
      "Failed to read cached user:",
      error
    );

    return null;
  }
}

function getCachedUserServerSnapshot(): null {
  return null;
}

function parseCachedUser(
  raw: string | null
): User | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.error(
      "Failed to parse cached user:",
      error
    );

    return null;
  }
}

// ============================================================
// Persist User
// ============================================================

function persistUser(data: User) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(data)
    );

    window.dispatchEvent(
      new Event(AUTH_USER_EVENT)
    );
  } catch (error) {
    console.error(
      "Failed to persist user data:",
      error
    );
  }
}

// ============================================================
// Clear Cached User
// ============================================================

function clearPersistedUser() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(
      USER_STORAGE_KEY
    );

    window.dispatchEvent(
      new Event(AUTH_USER_EVENT)
    );
  } catch (error) {
    console.error(
      "Failed to clear cached user:",
      error
    );
  }
}

// ============================================================
// Access Token Cookie
// ============================================================

function setAccessTokenCookie(
  token: string | null
) {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    document.cookie =
      "access_token=; path=/; max-age=0; SameSite=Lax";

    return;
  }

  document.cookie =
    `access_token=${encodeURIComponent(token)}; ` +
    "path=/; max-age=900; SameSite=Lax";
}

// ============================================================
// Request Refresh Token
//
// IMPORTANT:
// This function DOES NOT call setState().
// Therefore it is safe to call from useEffect.
// ============================================================

async function requestRefreshToken(): Promise<
  string | null
> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    const token =
      response.data?.access_token;

    if (
      typeof token !== "string" ||
      token.length === 0
    ) {
      throw new Error(
        "Refresh response did not contain a valid access_token"
      );
    }

    return token;
  } catch (error) {
    console.error(
      "Token refresh request failed:",
      error
    );

    return null;
  }
}

// ============================================================
// Provider Props
// ============================================================

interface AuthProviderProps {
  children: ReactNode;
}

// ============================================================
// Auth Provider
// ============================================================

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  // ----------------------------------------------------------
  // Access Token
  // ----------------------------------------------------------

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  // ----------------------------------------------------------
  // Auth Loading
  // ----------------------------------------------------------

  const [authLoading, setAuthLoading] =
    useState(true);

  // ==========================================================
  // Cached User
  //
  // useSyncExternalStore avoids setState inside an effect.
  // ==========================================================

  const cachedUserRaw =
    useSyncExternalStore(
      subscribeCachedUser,
      getCachedUserSnapshot,
      getCachedUserServerSnapshot
    );

  const cachedUser =
    useMemo(
      () =>
        parseCachedUser(
          cachedUserRaw
        ),
      [cachedUserRaw]
    );

  // ==========================================================
  // Decode JWT
  // ==========================================================

  const decodedToken =
    useMemo<JwtPayload | null>(() => {
      if (!accessToken) {
        return null;
      }

      try {
        return jwtDecode<JwtPayload>(
          accessToken
        );
      } catch (error) {
        console.error(
          "Invalid access token:",
          error
        );

        return null;
      }
    }, [accessToken]);

  // ==========================================================
  // Derived JWT Values
  // ==========================================================

  const userID =
    decodedToken?.sub ?? null;

  const isBanned =
    Boolean(decodedToken?.is_banned);

  const isPermanentBan =
    Boolean(
      decodedToken?.is_permanent_ban
    );

  const banReason =
    decodedToken?.ban_reason ?? null;

  const banUntil =
    decodedToken?.ban_until ?? null;

  // ==========================================================
  // Login
  // ==========================================================

  const login = useCallback(
    (token: string) => {
      setAccessToken(token);

      setAccessTokenCookie(token);
    },
    []
  );

  // ==========================================================
  // Refresh Token
  //
  // This function updates React state because it is normally
  // called from event handlers / other async code.
  //
  // IMPORTANT:
  // Initial useEffect DOES NOT call this function.
  // ==========================================================

  const refreshToken = useCallback(
    async (): Promise<string | null> => {
      const token =
        await requestRefreshToken();

      if (!token) {
        setAccessToken(null);
        setAccessTokenCookie(null);

        clearPersistedUser();

        return null;
      }

      setAccessToken(token);
      setAccessTokenCookie(token);

      return token;
    },
    []
  );

  // ==========================================================
  // Initial Authentication
  //
  // IMPORTANT:
  // The effect only starts an async operation.
  // State updates happen inside promise callbacks.
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    requestRefreshToken()
      .then((token) => {
        if (cancelled) {
          return;
        }

        if (!token) {
          setAccessToken(null);
          setAccessTokenCookie(null);
          clearPersistedUser();

          return;
        }

        setAccessToken(token);
        setAccessTokenCookie(token);
      })
      .finally(() => {
        if (cancelled) {
          return;
        }

        setAuthLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // User Data
  // ==========================================================

  const shouldFetchUser =
    Boolean(accessToken) &&
    Boolean(userID) &&
    !isBanned;

  const {
    data: userData,
    loading: userLoading,
    error,
  } = useUserData(
    shouldFetchUser
      ? {
          userID: userID!,
          accessToken: accessToken!,
        }
      : null
  );

  // ==========================================================
  // Persist API User
  //
  // No setState() here.
  // ==========================================================

  useEffect(() => {
    if (!userData) {
      return;
    }

    persistUser(userData);
  }, [userData]);

  // ==========================================================
  // Effective User
  //
  // API data has priority.
  // Cached data is fallback.
  //
  // If there is no access token, user is null.
  // ==========================================================

  const user =
    accessToken
      ? userData ?? cachedUser
      : null;

  const userInfo = user;

  // ==========================================================
  // Logout
  // ==========================================================

  const logout = useCallback(
    async () => {
      // Clear local auth immediately.

      setAccessToken(null);

      setAccessTokenCookie(null);

      clearPersistedUser();

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error(
          "Logout failed:",
          error
        );
      }
    },
    []
  );

  // ==========================================================
  // Context Value
  // ==========================================================

  const contextValue =
    useMemo<AuthContextType>(
      () => ({
        accessToken,

        userID,

        user,

        userInfo,

        loading:
          authLoading ||
          userLoading,

        error,

        login,

        logout,

        refreshToken,

        isBanned,

        isPermanentBan,

        banReason,

        banUntil,
      }),
      [
        accessToken,
        userID,
        user,
        userInfo,
        authLoading,
        userLoading,
        error,
        login,
        logout,
        refreshToken,
        isBanned,
        isPermanentBan,
        banReason,
        banUntil,
      ]
    );

  // ==========================================================
  // Provider
  // ==========================================================

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// useAuth
// ============================================================

export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "useAuth must be used inside AuthProvider"
      );
    }

    return context;
  };