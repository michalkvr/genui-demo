"use client";

import {useState} from "react";
import {motion} from "framer-motion";

interface NominationFormProps {
  onSubmit: (nomination: {
    title: string;
    artist: string;
    genre: string;
    coverUrl?: string;
  }) => void;
  onCancel: () => void;
}

export function NominationForm({onSubmit, onCancel}: NominationFormProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !artist.trim() || !genre.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre.trim(),
        coverUrl: coverUrl.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1}}
      exit={{opacity: 0, scale: 0.95}}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="glass-effect rounded-2xl p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Nominate an Album</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-white font-medium">
              Album Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter album title..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/20 transition-all duration-300"
              required
            />
          </div>

          {/* Artist Field */}
          <div className="space-y-2">
            <label htmlFor="artist" className="block text-white font-medium">
              Artist *
            </label>
            <input
              id="artist"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/20 transition-all duration-300"
              required
            />
          </div>

          {/* Genre Field */}
          <div className="space-y-2">
            <label htmlFor="genre" className="block text-white font-medium">
              Genre *
            </label>
            <input
              id="genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter genre..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/20 transition-all duration-300"
              required
            />
          </div>

          {/* Cover URL Field */}
          <div className="space-y-2">
            <label htmlFor="coverUrl" className="block text-white font-medium">
              Cover Image URL (optional)
            </label>
            <input
              id="coverUrl"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Enter cover image URL..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/20 transition-all duration-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !artist.trim() || !genre.trim()}
              className="flex-1 bg-[#1db954] border border-[#1db954] rounded-xl px-6 py-3 text-white font-medium hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Nomination"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}