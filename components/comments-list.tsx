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

interface CommentsListProps {
  ratings: Rating[];
  albums: Album[];
}

export function CommentsList({ ratings, albums }: CommentsListProps) {
  // Filter ratings that have comments
  const ratingsWithComments = ratings.filter(rating => rating.comment && rating.comment.trim() !== '');

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-400";
    if (score >= 3.5) return "text-yellow-400";
    if (score >= 2.5) return "text-orange-400";
    return "text-red-400";
  };

  const getAlbumInfo = (albumId: string) => {
    return albums.find(album => album.id === albumId);
  };

  if (ratingsWithComments.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H16M8 8H16M8 16H12M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4M7 4H17M7 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Comments Yet</h3>
          <p className="text-white/60">
            No one has left comments on album ratings yet. Be the first to share your thoughts!
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#1db954] rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H16M8 8H16M8 16H12M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4M7 4H17M7 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">All Comments & Ratings</h2>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {ratingsWithComments.map((rating, index) => {
          const album = getAlbumInfo(rating.albumId);
          
          return (
            <motion.div
              key={`${rating.albumId}-${rating.user}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              {/* Album Info & Rating */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {album ? (
                    <div className="mb-2">
                      <h4 className="font-semibold text-white text-lg">{album.title}</h4>
                      <p className="text-white/70">{album.artist}</p>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <p className="text-white/50 text-sm">Album not found (ID: {rating.albumId})</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">by {rating.user}</span>
                  </div>
                </div>
                
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        star <= rating.score
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
                  <span className={`ml-2 font-bold ${getScoreColor(rating.score)}`}>
                    {rating.score}/5
                  </span>
                </div>
              </div>
              
              {/* Comment */}
              <div className="bg-white/5 rounded-md p-3 border-l-4 border-[#1db954]">
                <p className="text-white leading-relaxed">
                  &ldquo;{rating.comment}&rdquo;
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Comments shown: {ratingsWithComments.length}</span>
          <span>Total ratings: {ratings.length}</span>
        </div>
      </div>
    </motion.div>
  );
}