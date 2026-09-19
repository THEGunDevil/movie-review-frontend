import { useAuth } from "@/context/AuthContext";
import { ErrorResponse } from "@/models/User";
import axios, { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useAdminActions(refreshCallback?: () => Promise<void>) {
  const { accessToken } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleBan = useCallback(
    async (userId: string, permanent: boolean) => {
      setActionLoading(userId);
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/ban/${userId}`,
          {
            is_permanent_ban: permanent,
            ban_reason: permanent
              ? "Permanently banned by admin"
              : "Temporarily banned",
            ban_until: permanent ? undefined : 24,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        toast.success(
          permanent ? "User permanently banned" : "User banned for 24h",
        );
        await refreshCallback?.();
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        const message =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          "Something went wrong";
        toast.error(message || "Failed to ban user");
      } finally {
        setActionLoading(null);
      }
    },
    [accessToken, refreshCallback],
  );

  const handleUnban = useCallback(
    async (userId: string) => {
      setActionLoading(userId);
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/unban/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        toast.success("User unbanned successfully");
        await refreshCallback?.();
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        const message =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          "Something went wrong";
        toast.error(message || "Failed to unban user");
      } finally {
        setActionLoading(null);
      }
    },
    [accessToken, refreshCallback],
  );

  return { handleBan, handleUnban, actionLoading };
}
