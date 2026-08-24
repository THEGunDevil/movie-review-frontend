"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Users,
  CalendarDays,
  User,
  Settings,
  Loader2,
} from "lucide-react";
import { EmptyComponent } from "@/components/EmptyComponent";
import WatchlistCard from "@/components/WatchList";
import { StatCard } from "@/components/StatCard";
import { TabButton } from "@/components/TabButton";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { PaginatedReviewResponse, ReviewWithMedia } from "@/models/Review";
import { UserProfile } from "@/models/User";
import { toast } from "sonner";
import { PaginatedWatchlistResponse, WatchlistItem } from "@/models/Watchlist";

type Tab = "reviews" | "about" | "watchlist";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function ProfilePage() {
  const { userID, accessToken } = useAuth();

  const [profile, setProfile] = useState<{
    data: UserProfile | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });

  const [reviews, setReviews] = useState<{
    data: ReviewWithMedia[];
    loading: boolean;
    error: string | null;
  }>({ data: [], loading: true, error: null });

  const [watchList, setWatchList] = useState<{
    data: PaginatedWatchlistResponse<WatchlistItem> | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });

  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!userID) return;

    const fetchProfile = async () => {
      setProfile({ data: null, loading: true, error: null });
      try {
        const { data } = await axios.get<UserProfile>(
          `${API_URL}/users/user_profile/${userID}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        setProfile({ data, loading: false, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load profile";
        setProfile({ data: null, loading: false, error: message });
        toast.error("Failed to fetch user profile", {
          position: "bottom-center",
        });
      }
    };

    const fetchReviews = async () => {
      setReviews({ data: [], loading: true, error: null });
      try {
        const { data } = await axios.get<
          PaginatedReviewResponse<ReviewWithMedia>
        >(`${API_URL}/reviews/${userID}/user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // data.reviews is the array
        setReviews({ data: data.reviews, loading: false, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load reviews";
        setReviews({ data: [], loading: false, error: message });
        toast.error("Failed to fetch user reviews", {
          position: "bottom-center",
        });
      }
    };

    const fetchWatchlist = async () => {
      setWatchList({ data: null, loading: true, error: null });
      try {
        const { data } = await axios.get<
          PaginatedWatchlistResponse<WatchlistItem>
        >(`${API_URL}/watchlist/${userID}`, {
          params: { page: 1, limit: 10 },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setWatchList({ data, loading: false, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load watchlist";
        setWatchList({ data: null, loading: false, error: message });
        toast.error("Failed to fetch watchlist", { position: "bottom-center" });
      }
    };

    fetchProfile();
    fetchReviews();
    fetchWatchlist();
  }, [userID, accessToken]);

  const isLoading = profile.loading || reviews.loading || watchList.loading;
  const error = profile.error || reviews.error || watchList.error;
  const profileData = profile.data;
  const reviewList = reviews.data;
  const watchlistData = watchList.data?.watchlist ?? [];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300">
        <p className="text-lg">{error || "User not found"}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const isOwnProfile = profileData.id === userID;

  return (
    <main className="min-h-screen mx-auto bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Header */}
        <div className="relative h-fit mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div className="absolute top-0 left-0 h-32 w-full bg-linear-to-r from-red-500/10 to-amber-500/10 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-start gap-6">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-800">
              {profileData.profile_picture ? (
                <Image
                  src={profileData.profile_picture}
                  alt={profileData.user_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-800">
                  <User className="h-12 w-12 text-slate-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-white truncate">
                  {profileData.user_name}
                </h1>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700"
                  >
                    <Settings className="mr-1 h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {profileData.bio || "No bio yet"}
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <CalendarDays className="h-3 w-3" />
                Joined {formatDate(profileData.join_date)}
              </p>
            </div>
            {!isOwnProfile && accessToken && (
              <Button
                onClick={() => {}}
                disabled={followLoading}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                {followLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : profileData.is_following ? (
                  "Following"
                ) : (
                  "Follow"
                )}
              </Button>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

        {/* Tabs */}
        <section>
          <div className="mb-6 flex gap-2 border-b border-slate-800">
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

          {/* Content */}
          <div className="max-h-[24%] overflow-scroll scrollbar-hide border scroll-auto">
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
                      onSave={() => {}}
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
            {activeTab === "watchlist" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {watchlistData.length === 0 ? (
                  <EmptyComponent message="Watchlist is empty" />
                ) : (
                  watchlistData.map((item) => (
                    <WatchlistCard key={item.id} item={item} />
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
