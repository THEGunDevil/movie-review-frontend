"use client";

import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  CalendarDays,
  ChevronRight,
  Loader2,
  MessageSquare,
  Settings,
  Star,
  ThumbsUp,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/format";

import { ReviewCard } from "@/components/ReviewCard";
import { StatCard } from "@/components/StatCard";
import { TabButton } from "@/components/TabButton";
import { EmptyComponent } from "@/components/EmptyComponent";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { Button } from "@/components/ui/button";
import WatchlistCard from "@/components/WatchListCard";

import { PaginatedReviewResponse, ReviewWithMedia } from "@/models/Review";

import { UserProfile, ErrorResponse } from "@/models/User";

import { PaginatedWatchlistResponse, WatchlistItem } from "@/models/Watchlist";
import { EditProfileDialog } from "@/components/EditProfileDialog";

type Tab = "reviews" | "watchlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfilePage() {
  const { userID, accessToken, loading: authLoading } = useAuth();

  // =========================================================
  // Profile state
  // =========================================================

  const [profile, setProfile] = useState<{
    data: UserProfile | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  // =========================================================
  // Reviews state
  // =========================================================

  const [reviews, setReviews] = useState<{
    data: ReviewWithMedia[];
    loading: boolean;
    error: string | null;
  }>({
    data: [],
    loading: true,
    error: null,
  });

  // =========================================================
  // Watchlist state
  // =========================================================

  const [watchList, setWatchList] = useState<{
    data: PaginatedWatchlistResponse<WatchlistItem> | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });


  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [followLoading, setFollowLoading] = useState(false);

  const [editProfile, setEditProfile] = useState<{
    open: boolean;
    name: string;
    bio: string;
    image: string;
    imageFile: File | null;
    removeImage: boolean;
    saving: boolean;
  }>({
    open: false,
    name: "",
    bio: "",
    image: "",
    imageFile: null,
    removeImage: false,
    saving: false,
  });

  // =========================================================
  // Axios instance
  // =========================================================

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    instance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    return instance;
  }, [accessToken]);

  // =========================================================
  // Error helper
  // =========================================================

  const getErrorMessage = useCallback((error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<ErrorResponse>;

    return axiosError.response?.data?.message ?? axiosError.message ?? fallback;
  }, []);

  // =========================================================
  // Fetch profile
  // =========================================================

  const fetchProfile = useCallback(async () => {
    if (!userID) {
      return;
    }

    setProfile((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await api.get<UserProfile>(
        `/users/user_profile/${userID}`,
      );

      setProfile({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load profile");

      setProfile({
        data: null,
        loading: false,
        error: message,
      });
    }
  }, [api, getErrorMessage, userID]);

  // =========================================================
  // Fetch reviews
  // =========================================================

  const fetchReviews = useCallback(async () => {
    if (!userID) {
      return;
    }

    setReviews((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await api.get<PaginatedReviewResponse<ReviewWithMedia>>(
        `/reviews/${userID}/user`,
      );

      setReviews({
        data: response.data.reviews ?? [],
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load reviews");

      setReviews({
        data: [],
        loading: false,
        error: message,
      });
    }
  }, [api, getErrorMessage, userID]);

  // =========================================================
  // Fetch watchlist
  // =========================================================

  const fetchWatchlist = useCallback(async () => {
    if (!userID) {
      return;
    }

    setWatchList((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await api.get<PaginatedWatchlistResponse<WatchlistItem>>(
        `/watchlist/user/${userID}`,
        {
          params: {
            page: 1,
            limit: 12,
          },
        },
      );

      setWatchList({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load watchlist");

      setWatchList({
        data: null,
        loading: false,
        error: message,
      });
    }
  }, [api, getErrorMessage, userID]);

  useEffect(() => {
    if (authLoading || !userID || !accessToken) return;
  
    const timer = setTimeout(() => {
      void Promise.all([
        fetchProfile(),
        fetchReviews(),
        fetchWatchlist(),
      ]);
    }, 0);
  
    return () => clearTimeout(timer);
  }, [
    authLoading,
    accessToken,
    userID,
    fetchProfile,
    fetchReviews,
    fetchWatchlist,
  ]);

  // =========================================================
  // Derived profile data
  // IMPORTANT:
  // Declare this BEFORE functions that depend on it.
  // =========================================================

  const profileData = profile.data;

  const reviewList = reviews.data;

  const watchlistData = watchList.data?.watchlist ?? [];

  const totalWatchlist = watchList.data?.total_pages ?? watchlistData.length;

  const pageLoading =
    authLoading || profile.loading || reviews.loading || watchList.loading;

  const pageError = profile.error || reviews.error || watchList.error || null;

  const isOwnProfile = profileData?.id === userID;
  // =========================================================
  // Open edit dialog
  // =========================================================

  const handleOpenEditProfile = () => {
    if (!profileData) {
      return;
    }

    setEditProfile({
      open: true,
      name: profileData.user_name ?? "",
      bio: profileData.bio ?? "",
      image: profileData.profile_picture ?? "",
      imageFile: null,
      removeImage: false,
      saving: false,
    });
  };

  // =========================================================
  // Close edit dialog
  // =========================================================

  const handleCloseEditProfile = () => {
    if (editProfile.saving) {
      return;
    }

    setEditProfile((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // =========================================================
  // Edit field change
  // =========================================================

  const handleEditChange = (field: "name" | "bio", value: string) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // Profile image change
  // =========================================================

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Profile image must be smaller than 5MB.");

      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setEditProfile((prev) => {
      if (prev.image && prev.image.startsWith("blob:")) {
        URL.revokeObjectURL(prev.image);
      }

      return {
        ...prev,
        image: previewUrl,
        imageFile: file,
        removeImage: false,
      };
    });

    event.target.value = "";
  };

  // =========================================================
  // Remove profile image
  // =========================================================

  const handleRemoveProfileImage = () => {
    setEditProfile((prev) => {
      if (prev.image && prev.image.startsWith("blob:")) {
        URL.revokeObjectURL(prev.image);
      }

      return {
        ...prev,
        image: "",
        imageFile: null,
        removeImage: true,
      };
    });
  };

  // =========================================================
  // Save profile
  // =========================================================

  const handleSaveProfile = async () => {
    const name = editProfile.name.trim();

    const bio = editProfile.bio.trim();

    if (!name) {
      toast.error("Username cannot be empty.", {
        position: "top-center",
      });

      return;
    }

    if (!userID) {
      toast.error("User session not found.");
      return;
    }

    setEditProfile((prev) => ({
      ...prev,
      saving: true,
    }));

    try {
      /*
       * IMPORTANT
       *
       * Replace this endpoint with your actual
       * backend profile update endpoint if necessary.
       *
       * This version uses multipart/form-data because
       * the request can contain both text and image.
       */

      const formData = new FormData();

      formData.append("user_name", name);
      formData.append("bio", bio);

      if (editProfile.imageFile) {
        formData.append("profile_picture", editProfile.imageFile);
      }

      if (editProfile.removeImage) {
        formData.append("remove_profile_picture", "true");
      }

      /*
       * Change this URL if your Go backend uses
       * a different endpoint.
       */
      await api.patch(`/users/profile/${userID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reload the real profile from backend.
      await fetchProfile();

      // Clean temporary blob URL.
      if (editProfile.image && editProfile.image.startsWith("blob:")) {
        URL.revokeObjectURL(editProfile.image);
      }

      setEditProfile({
        open: false,
        name,
        bio,
        image: "",
        imageFile: null,
        removeImage: false,
        saving: false,
      });

      toast.success("Profile updated successfully.", {
        position: "top-center",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update profile");

      toast.error(message, {
        position: "bottom-center",
      });

      setEditProfile((prev) => ({
        ...prev,
        saving: false,
      }));
    }
  };

  // =========================================================
  // Retry
  // =========================================================

  const handleRetry = async () => {
    if (authLoading || !userID || !accessToken) {
      return;
    }

    await Promise.all([fetchProfile(), fetchReviews(), fetchWatchlist()]);
  };

  // =========================================================
  // Loading
  // =========================================================

  if (pageLoading) {
    return <ProfileSkeleton />;
  }

  // =========================================================
  // Error
  // =========================================================

  if (pageError || !profileData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
            <User className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {pageError ?? "User not found"}
          </p>

          <Button
            variant="outline"
            className="mt-6 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  // =========================================================
  // Page
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            Profile Hero
        ====================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-r from-red-500/10 via-indigo-500/10 to-violet-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
              {/* User info */}

              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}

                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-800 shadow-xl ring-4 ring-slate-900 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                  {profileData.profile_picture ? (
                    <Image
                      src={profileData.profile_picture}
                      alt={profileData.user_name}
                      fill
                      priority
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-12 w-12 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Info */}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="max-w-full truncate text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {profileData.user_name}
                    </h1>

                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenEditProfile}
                        className="border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                      >
                        <Settings className="mr-1.5 h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                    {profileData.bio ||
                      "No bio yet. Tell the community a little about yourself."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      Joined {formatDate(profileData.join_date)}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span>{profileData.follower_count} followers</span>
                  </div>
                </div>
              </div>

              {/* Follow */}

              {!isOwnProfile && accessToken && (
                <Button
                  onClick={() => {}}
                  disabled={followLoading}
                  className="self-start bg-red-600 px-5 text-white shadow-lg shadow-red-950/20 hover:bg-red-500"
                >
                  {followLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : profileData.is_following ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Button>
              )}
            </div>

            {/* Stats */}

            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                icon={<Star className="h-4 w-4 text-amber-400" />}
                label="Reviews"
                value={profileData.review_count}
              />

              <StatCard
                icon={<ThumbsUp className="h-4 w-4 text-red-400" />}
                label="Likes"
                value={profileData.like_count}
              />

              <StatCard
                icon={<MessageSquare className="h-4 w-4 text-cyan-400" />}
                label="Comments"
                value={profileData.comment_count}
              />

              <StatCard
                icon={<Users className="h-4 w-4 text-emerald-400" />}
                label="Followers"
                value={profileData.follower_count}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            Tabs
        ====================================================== */}

        <section>
          <div className="mb-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex gap-1">
              <TabButton
                active={activeTab === "reviews"}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </TabButton>

              <TabButton
                active={activeTab === "watchlist"}
                onClick={() => setActiveTab("watchlist")}
              >
                Watchlist
              </TabButton>
            </div>

            <span className="hidden pb-3 text-xs text-slate-500 sm:block">
              {activeTab === "reviews"
                ? `${reviewList.length} ${
                    reviewList.length === 1 ? "review" : "reviews"
                  }`
                : `${totalWatchlist} saved`}
            </span>
          </div>

          {/* ===================================================
              Reviews
          ==================================================== */}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {reviewList.length === 0 ? (
                <EmptyComponent message="No reviews yet" />
              ) : (
                reviewList.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isExpanded={false}
                    isEditing={false}
                    editContent=""
                    isSaving={false}
                    menuOpen={false}
                    comments={[]}
                    commentsLoading={false}
                    commentSubmitting={false}
                    onToggleComments={() => {}}
                    onLike={() => {}}
                    onVote={() => {}}
                    onMenuToggle={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onReport={() => {}}
                    onEditChange={() => {}}
                    onCancelEdit={() => {}}
                    onSaveEdit={() => {}}
                    onCommentSubmit={() => {}}
                  />
                ))
              )}
            </div>
          )}

          {/* ===================================================
              Watchlist
          ==================================================== */}

          {activeTab === "watchlist" && (
            <div>
              {watchlistData.length === 0 ? (
                <div className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6 sm:p-10">
                  <EmptyComponent message="Watchlist is empty" />
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                        Saved collection
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-white">
                        Watchlist
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {totalWatchlist}{" "}
                        {totalWatchlist === 1 ? "title" : "titles"} saved for
                        later
                      </p>
                    </div>

                    <button
                      type="button"
                      className="hidden items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-white sm:inline-flex"
                    >
                      View all
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {watchlistData.map((item) => (
                      <WatchlistCard key={item.id} item={item} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
      <EditProfileDialog
        editProfile={editProfile}
        handleCloseEditProfile={handleCloseEditProfile}
        handleProfileImageChange={handleProfileImageChange}
        handleRemoveProfileImage={handleRemoveProfileImage}
        handleEditChange={handleEditChange}
        handleSaveProfile={handleSaveProfile}
      />{" "}
    </main>
  );
}
