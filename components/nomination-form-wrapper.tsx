"use client";

import { useState } from "react";
import { NominationForm } from "./nomination-form";

interface InitialData {
  title?: string;
  artist?: string;
  genre?: string;
  coverUrl?: string;
}

interface NominationFormWrapperProps {
  initialData?: InitialData;
}

export function NominationFormWrapper({ initialData }: NominationFormWrapperProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (nomination: {
    title: string;
    artist: string;
    genre: string;
    coverUrl?: string;
  }) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/nominations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nomination),
      });
      if (!res.ok) {
        throw new Error("Failed to submit nomination");
      }
      setSuccess(true);
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
      <NominationForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={initialData}
      />
      {submitting && <p className="text-blue-500 mt-4">Submitting...</p>}
      {success && <p className="text-green-500 mt-4">Nomination submitted successfully!</p>}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
}
