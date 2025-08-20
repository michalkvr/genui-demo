interface StatsCardProps {
  avg: number | null;
  count: number;
}

export function StatsCard({avg, count}: StatsCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "from-green-400 to-emerald-500";
    if (score >= 3.5) return "from-yellow-400 to-orange-500";
    if (score >= 2.5) return "from-orange-400 to-red-500";
    return "from-red-400 to-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Average";
    return "Below Average";
  };

  return (
    <div className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover-lift">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1db954] rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <h3 className="font-bold text-white text-xl">Rating Overview</h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center space-y-2">
            <div className="relative">
              {avg !== null ? (
                <>
                  <div className={`text-4xl font-black bg-gradient-to-r ${getScoreColor(avg)} bg-clip-text text-transparent`}>
                    {avg.toFixed(1)}
                  </div>
                  <div className="text-sm text-white/60 font-medium mt-1">
                    {getScoreLabel(avg)}
                  </div>
                </>
              ) : (
                <div className="text-4xl font-black text-white/40">
                  N/A
                </div>
              )}
            </div>
            <div className="text-white/70 font-medium">Average Rating</div>
          </div>

          {/* Total Ratings */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-black text-[#1db954]">
              {count}
            </div>
            <div className="text-white/70 font-medium">Total Ratings</div>
          </div>
        </div>

        {/* Star Rating Display */}
        {avg !== null && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`relative w-8 h-8 transition-all duration-300 ${
                    star <= avg ? "scale-110" : "scale-100"
                  }`}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      star <= avg
                        ? "text-[#1db954] drop-shadow-lg"
                        : "text-white/20"
                    } transition-colors duration-300`}
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                  {star <= avg && (
                    <div className="absolute inset-0 w-8 h-8">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-400 animate-pulse"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                          fill="currentColor"
                          opacity="0.3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Rating Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getScoreColor(avg)} transition-all duration-1000 ease-out`}
                style={{ width: `${(avg / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}