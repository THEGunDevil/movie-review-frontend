"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";
import axios, { AxiosError } from "axios";
import {
  ErrorResponse,
  User,
  UseUserDataProps,
} from "@/models/User";

export function useUserData(
  props: UseUserDataProps | null,
) {
  const [data, setData] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const userID =
    props?.userID ?? null;

  const accessToken =
    props?.accessToken ?? null;

  // =========================================================
  // Automatically fetch user
  // =========================================================

  useEffect(() => {
    if (!userID || !accessToken) {
      return;
    }

    let cancelled = false;

    const loadUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await axios.get<User>(
            `${process.env.NEXT_PUBLIC_API_URL}/users/user/${userID}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

        if (cancelled) {
          return;
        }

        setData(response.data);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const axiosError =
          err as AxiosError<ErrorResponse>;

        if (
          axiosError.response?.status === 403 &&
          axiosError.response.data
        ) {
          setData(
            axiosError.response.data as User,
          );
        } else {
          setError(
            axiosError.response?.data?.message ??
              axiosError.message ??
              "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [userID, accessToken]);

  // =========================================================
  // Manual refetch
  // =========================================================

  const fetchUser = useCallback(async () => {
    if (!userID || !accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await axios.get<User>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/user/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

      setData(response.data);
    } catch (err) {
      const axiosError =
        err as AxiosError<ErrorResponse>;

      if (
        axiosError.response?.status === 403 &&
        axiosError.response.data
      ) {
        setData(
          axiosError.response.data as User,
        );
      } else {
        setError(
          axiosError.response?.data?.message ??
            axiosError.message ??
            "Something went wrong",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [userID, accessToken]);

  return {
    data,
    loading,
    error,
    fetchUser,
  };
}