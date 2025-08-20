"use client";

import {useState} from "react";
import {motion} from "framer-motion";

interface RatingFormProps {
  albumTitle: string;
  albumArtist: string;
  albumId: string;
  onSubmit: (rating: {
    albumId: string;
    user: string;
    score: number;
    comment?: string;
  }) => void;
  onCancel: () => void;
}

export function RatingForm({albumTitle, albumArtist, albumId, onSubmit, onCancel}: RatingFormProps) {
  const [user, setUser] = useState("");
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.trim() || score === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        albumId,
        user: user.trim(),
        score,
        comment: comment.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-400";
    if (score >= 3.5) return "text-yellow-400";
    if (score >= 2.5) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Average";
    if (score >= 1) return "Below Average";
    return "Select a rating";
  };

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1}}
      exit={{opacity: 0, scale: 0.95}}
      className="w-full mx-auto"
    >
      <div
        className="glass-effect rounded-xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#1db954] rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Rate Album</h2>
            <p className="text-white/70 text-sm">{albumTitle} by {albumArtist}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* First Row: Name and Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {/* User Name Field */}
            <div className="space-y-1">
              <label htmlFor="user" className="block text-white font-medium text-sm">
                Your Name *
              </label>
              <input
                id="user"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]/20 transition-all duration-300"
                required
              />
            </div>

            {/* Rating Stars */}
            <div className="space-y-1">
              <label className="block text-white font-medium text-sm">
                Your Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setScore(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={`relative w-8 h-8 transition-all duration-200 ${
                      star <= (hoveredStar || score) ? "scale-110" : "scale-100"
                    }`}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        star <= (hoveredStar || score)
                          ? "text-[#1db954] drop-shadow-lg"
                          : "text-white/30"
                      } transition-colors duration-200 hover:text-[#1db954]`}
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                ))}
                <span className={`ml-2 text-sm font-medium ${score > 0 ? getScoreColor(score) : 'text-white/50'}`}>
                  {getScoreLabel(score)}
                </span>
              </div>
            </div>
          </div>

          {/* Comment Field */}
          <div className="space-y-1">
            <label htmlFor="comment" className="block text-white font-medium text-sm">
              Comment (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this album..."
              rows={2}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]/20 transition-all duration-300 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !user.trim() || score === 0}
              className="flex-1 bg-[#1db954] border border-[#1db954] rounded-xl px-6 py-3 text-white font-medium hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}