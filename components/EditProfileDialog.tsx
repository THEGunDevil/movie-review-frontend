"use client";

import { ChangeEvent, ReactNode, useEffect, useRef } from "react";
import {
  Camera,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// Dialog State Interface
// ============================================================
export interface EditProfileState {
  open: boolean;
  name: string;
  bio: string;
  image: string;
  imageFile: File | null;
  removeImage: boolean;
  saving: boolean;
}

interface EditProfileDialogProps {
  editProfile: EditProfileState;
  handleCloseEditProfile: () => void;
  handleProfileImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveProfileImage: () => void;
  handleEditChange: (field: "name" | "bio", value: string) => void;
  handleSaveProfile: () => Promise<void>;
}

// ============================================================
// Main Component
// ============================================================
export function EditProfileDialog({
  editProfile,
  handleCloseEditProfile,
  handleProfileImageChange,
  handleRemoveProfileImage,
  handleEditChange,
  handleSaveProfile,
}: EditProfileDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Escape key close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editProfile.open && !editProfile.saving) {
        handleCloseEditProfile();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [editProfile.open, editProfile.saving, handleCloseEditProfile]);

  // Autofocus on open
  useEffect(() => {
    if (editProfile.open && nameInputRef.current) {
      // Delay to allow animation
      const timer = setTimeout(() => nameInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [editProfile.open]);

  if (!editProfile.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => {
          if (!editProfile.saving) handleCloseEditProfile();
        }}
      />

      {/* Dialog Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        aria-describedby="edit-profile-description"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/60 animate-in zoom-in-95 fade-in duration-200"
      >
        {/* ===== Header ===== */}
        <div className="border-b border-slate-800/80 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                id="edit-profile-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-white"
              >
                Edit Profile
              </h2>
              <p
                id="edit-profile-description"
                className="mt-1 text-xs sm:text-sm text-slate-500"
              >
                Update your profile photo and personal information.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseEditProfile}
              disabled={editProfile.saving}
              aria-label="Close dialog"
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-5 sm:p-7">
          <div className="grid gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-10">
            {/* LEFT - Profile Photo */}
            <div className="flex flex-col md:border-r md:border-slate-800/80 md:pr-8">
              <h3 className="text-sm font-semibold text-slate-200">Profile Photo</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose a photo that represents you.
              </p>

              <div className="mt-6 flex flex-col items-center md:items-start">
                <div className="relative group">
                  <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/5 transition-all duration-300 group-hover:ring-2 group-hover:ring-indigo-500/50">
                    {editProfile.image ? (
                      <img
                        src={editProfile.image}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-500/10 via-slate-900 to-violet-500/10">
                        <ImagePlus className="h-10 w-10 text-slate-600" />
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="profile-image"
                    title="Change profile photo"
                    className="absolute bottom-1 right-1 flex h-9 w-9 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full border-4 border-slate-950 bg-indigo-600 text-white shadow-xl shadow-indigo-950/40 transition-all duration-200 hover:scale-105 hover:bg-indigo-500 active:scale-95"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={editProfile.saving}
                    onChange={handleProfileImageChange}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    disabled={editProfile.saving}
                    onClick={() => document.getElementById("profile-image")?.click()}
                    className="h-9 rounded-lg border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Change
                  </Button>

                  {editProfile.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={editProfile.saving}
                      onClick={handleRemoveProfileImage}
                      className="h-9 rounded-lg px-3 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>

                <p className="mt-3 text-[11px] leading-5 text-slate-600">
                  JPG, PNG or WebP
                  <br />
                  Maximum size 5MB
                </p>
              </div>
            </div>

            {/* RIGHT - Form */}
            <div className="min-w-0 space-y-5 sm:space-y-6">
              {/* Username */}
              <div className="space-y-2.5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <label htmlFor="profile-name" className="text-sm font-semibold text-slate-200">
                      Username
                    </label>
                    <p className="mt-1 text-xs text-slate-500">Your public display name.</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-slate-600">
                    {editProfile.name.length}/50
                  </span>
                </div>

                <input
                  id="profile-name"
                  ref={nameInputRef}
                  type="text"
                  value={editProfile.name}
                  onChange={(event) => handleEditChange("name", event.target.value)}
                  maxLength={50}
                  disabled={editProfile.saving}
                  placeholder="Enter your username"
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 text-sm font-medium text-white outline-none transition-all placeholder:text-slate-600 hover:border-slate-700 focus:border-indigo-500/60 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2.5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <label htmlFor="profile-bio" className="text-sm font-semibold text-slate-200">
                      Bio
                    </label>
                    <p className="mt-1 text-xs text-slate-500">Tell the community a little about yourself.</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-slate-600">
                    {editProfile.bio.length}/250
                  </span>
                </div>

                <textarea
                  id="profile-bio"
                  value={editProfile.bio}
                  onChange={(event) => handleEditChange("bio", event.target.value)}
                  maxLength={250}
                  rows={6}
                  disabled={editProfile.saving}
                  placeholder="Tell the community a little about yourself..."
                  className="min-h-37.5 w-full resize-none rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-slate-600 hover:border-slate-700 focus:border-indigo-500/60 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

{/* ===== Footer ===== */}
<div className="border-t border-slate-800/80 items-center flex bg-slate-950 h-14 px-5 sm:px-7">
  <div className="flex w-full flex-row items-center md:justify-between justify-end gap-3">
    <p className="hidden text-xs text-slate-600 md:block">
      Changes will be saved after clicking "Save Changes".
    </p>

    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={editProfile.saving}
        onClick={handleCloseEditProfile}
        className="rounded-md border-slate-700 bg-slate-900 h-10 px-4 text-sm text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
      >
        Cancel
      </Button>

      <Button
        type="button"
        disabled={editProfile.saving || !editProfile.name.trim()}
        onClick={handleSaveProfile}
        className="rounded-md bg-indigo-600 px-5 text-sm h-10 font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 hover:shadow-indigo-950/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {editProfile.saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}