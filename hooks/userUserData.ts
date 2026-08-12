"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";
import { ErrorResponse, User, UseUserDataProps } from "@/models/user";

export function useUserData(props: UseUserDataProps | null) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract current values or nulls
  const userID = props?.userID ?? null;
  const accessToken = props?.accessToken ?? null;

  // Keep track of the last fetched IDs to avoid duplicate fetches
  const lastFetchedRef = useRef<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userID || !accessToken) {
      setData(null);
      setLoading(false);
      return;
    }

    // Skip if same user already fetched
    if (lastFetchedRef.current === userID) return;

    lastFetchedRef.current = userID;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<User>(
        `${process.env.NEXT_PUBLIC_API_URL}/users/user/${userID}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setData(response.data);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response?.status === 403 && error.response.data) {
        setData(error.response.data as User);
      } else {
        setError(
          error.response?.data?.message ??
            error.message ??
            "Something went wrong",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [userID, accessToken]);   // ✅ stable dependencies (strings)

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { data, loading, error, fetchUser };
}