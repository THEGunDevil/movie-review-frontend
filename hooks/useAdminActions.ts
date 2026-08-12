import { useAuth } from "@/context/AuthContext";
import axios from "axios";
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
            ban_reason: permanent ? "Permanently banned by admin" : "Temporarily banned",
            ban_until: permanent ? undefined : 24,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success(permanent ? "User permanently banned" : "User banned for 24h");
        await refreshCallback?.();
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to ban user");
      } finally {
        setActionLoading(null);
      }
    },
    [accessToken, refreshCallback]
  );

  const handleUnban = useCallback(
    async (userId: string) => {
      setActionLoading(userId);
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/unban/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success("User unbanned successfully");
        await refreshCallback?.();
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to unban user");
      } finally {
        setActionLoading(null);
      }
    },
    [accessToken, refreshCallback]
  );

  return { handleBan, handleUnban, actionLoading };
}