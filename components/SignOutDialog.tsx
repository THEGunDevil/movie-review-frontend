// components/SignOutDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface SignOutDialogProps {
  trigger?: React.ReactNode;
}

export default function SignOutDialog({ trigger }: SignOutDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  // Add a mounted state to prevent SSR hydration mismatch with portals
  const [mounted, setMounted] = useState(false);
  
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      toast.success("Signing Out, Redirecting…!", { position: "top-center" });
      logout();
      setTimeout(() => {
        toast.success("Logged out successfully!", { position: "top-center" });
      }, 1000);
      router.push("/authentication/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setIsSigningOut(false);
      setOpen(false);
    }
  };

  // The modal overlay JSX
  const modalContent = open ? (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      {/* Card - stop propagation so clicking inside doesn't close */}
      <div
        className="relative w-[90%] max-w-md bg-[#0d131d] border border-slate-700/60 rounded-xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-mono text-left text-lg font-semibold text-slate-100">
          Confirm Log Out
        </h2>
        <p className="text-xs text-slate-400 text-left mb-6 mt-2 font-mono">
          Are you sure you want to log out? Your current session will be
          terminated and you will be redirected to the login page.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg border border-slate-700/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 font-mono text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="px-4 py-2 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white font-mono text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isSigningOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Render the modal into the body using createPortal */}
      {mounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}