"use client";

import { useState } from "react";
import { RatingForm } from "./rating-form";

interface RatingFormWrapperProps {
  albumTitle: string;
  albumArtist: string;
  albumId: string;
}

export function RatingFormWrapper({ albumTitle, albumArtist, albumId }: RatingFormWrapperProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [albumAdvanced, setAlbumAdvanced] = useState(false);

  const handleSubmit = async (rating: {
    albumId: string;
    user: string;
    score: number;
    comment?: string;
  }) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    setAlbumAdvanced(false);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rating),
      });
      if (!res.ok) {
        throw new Error("Failed to submit rating");
      }
      setSuccess(true);
      // Advance to next album
      const pickRes = await fetch("/api/pick-next-album", {
        method: "POST",
      });
      if (pickRes.ok) {
        setAlbumAdvanced(true);
      } else {
        const pickData = await pickRes.json();
        setError(pickData.error || "Failed to advance to next album");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <div>
      <RatingForm
        albumTitle={albumTitle}
        albumArtist={albumArtist}
        albumId={albumId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      {submitting && <p className="text-blue-500 mt-4">Submitting...</p>}
      {success && <p className="text-green-500 mt-4">Rating submitted successfully!</p>}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {albumAdvanced && <p className="text-purple-500 mt-4">Album advanced! Refresh to see the next album.</p>}
    </div>
  );
}
