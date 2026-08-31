"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Heart, Share2, Flag } from "lucide-react";

type Props = {
  initialUpvotes: number;
  entryKata: string;
  entryId: string;
};

export function ActionBar({ initialUpvotes, entryKata, entryId }: Props) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    setUpvotes((u) => u + 1);
    setHasUpvoted(true);
    try {
      const res = await fetch(`/api/entries/${entryId}/upvote`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { upvotes: total } = await res.json();
      setUpvotes(total);
      toast.success("Terima kasih dukunganmu");
    } catch {
      // rollback kalau gagal
      setUpvotes((u) => Math.max(0, u - 1));
      setHasUpvoted(false);
      toast.error("Gagal memberi dukungan", {
        description: "Coba lagi sebentar ya.",
      });
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: entryKata, url });
        return;
      } catch {
        // user cancel, fallback ke clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link disalin ke clipboard");
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  const handleReport = () => {
    toast.info("Terima kasih laporanmu", {
      description: "Fitur laporkan lengkap akan segera hadir.",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-sl-ink-100 pt-6">
      <button
        type="button"
        onClick={handleUpvote}
        disabled={hasUpvoted}
        aria-label={
          hasUpvoted
            ? `Sudah didukung, total ${upvotes} suara`
            : `Beri dukungan pada kata ${entryKata}, total ${upvotes} suara`
        }
        className={`btn-pill btn-pill-md ${
          hasUpvoted ? "btn-pill-primary" : "btn-pill-outline"
        } disabled:cursor-default disabled:opacity-100`}
      >
        <Heart
          className={`h-4 w-4 ${hasUpvoted ? "fill-current" : ""}`}
          strokeWidth={2}
        />
        Dukung {upvotes}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="btn-pill btn-pill-md btn-pill-outline"
      >
        <Share2 className="h-4 w-4" strokeWidth={2} />
        Bagikan
      </button>

      <button
        type="button"
        onClick={handleReport}
        className="btn-pill btn-pill-md btn-pill-ghost"
      >
        <Flag className="h-4 w-4" strokeWidth={2} />
        Laporkan
      </button>
    </div>
  );
}
