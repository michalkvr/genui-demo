"use client";

import { motion } from "framer-motion";

interface Rating {
  albumId: string;
  user: string;
  score: number;
  comment?: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  genre?: string;
}

interface RatingsTableProps {
  ratings: Rating[];
  albums: Album[];
}

export function RatingsTable({ ratings, albums }: RatingsTableProps) {
  // Group ratings by album
  const albumRatings = ratings.reduce((acc, rating) => {
    if (!acc[rating.albumId]) {
      acc[rating.albumId] = [];
    }
    acc[rating.albumId].push(rating);
    return acc;
  }, {} as Record<string, Rating[]>);

  // Calculate averages
  const albumAverages = Object.keys(albumRatings).map(albumId => {
    const album = albums.find(a => a.id === albumId);
    const ratingsForAlbum = albumRatings[albumId];
    const average = ratingsForAlbum.reduce((sum, r) => sum + r.score, 0) / ratingsForAlbum.length;
    
    return {
      album,
      ratings: ratingsForAlbum,
      average,
      count: ratingsForAlbum.length
    };
  }).filter(item => item.album); // Only include albums that exist

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-400";
    if (score >= 3.5) return "text-yellow-400";
    if (score >= 2.5) return "text-orange-400";
    return "text-red-400";
  };

  if (albumAverages.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Ratings Found</h3>
          <p className="text-white/60">
            No albums have been rated yet. Start rating some albums to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-[#1db954] rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white">All Album Ratings</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-2 text-white/80 font-semibold text-sm">Album</th>
              <th className="text-left py-3 px-2 text-white/80 font-semibold text-sm">Artist</th>
              <th className="text-left py-3 px-2 text-white/80 font-semibold text-sm">Genre</th>
              <th className="text-center py-3 px-2 text-white/80 font-semibold text-sm">Avg Rating</th>
              <th className="text-center py-3 px-2 text-white/80 font-semibold text-sm">Total Ratings</th>
            </tr>
          </thead>
          <tbody>
            {albumAverages
              .sort((a, b) => b.average - a.average)
              .map((item, index) => (
                <motion.tr
                  key={item.album!.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="py-3 px-2">
                    <div className="font-medium text-white">{item.album!.title}</div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-white/70">{item.album!.artist}</div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-white/60 text-sm">{item.album!.genre || 'N/A'}</div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`font-bold text-lg ${getScoreColor(item.average)}`}>
                        {item.average.toFixed(1)}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`${
                              star <= item.average
                                ? "text-[#1db954]"
                                : "text-white/20"
                            }`}
                          >
                            <path
                              d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                              fill="currentColor"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-white font-medium">{item.count}</span>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Total albums rated: {albumAverages.length}</span>
          <span>Total ratings: {ratings.length}</span>
        </div>
      </div>
    </motion.div>
  );
}