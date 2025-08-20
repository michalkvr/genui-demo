interface AlbumCardProps {
  title: string;
  artist: string;
  genre?: string;
  coverUrl?: string;
}

export function AlbumCard({title, artist, genre, coverUrl}: AlbumCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover-lift cursor-pointer transition-all duration-300 hover:border-[#1db954]/50 hover:shadow-2xl hover:shadow-[#1db954]/20">
      {/* Cover image - Always use music-themed placeholder */}
      <div className="relative overflow-hidden">
        <div className="aspect-square rounded-t-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V21M9 9L21 12L9 15V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-2">
        <h3 className="font-bold text-white text-xl leading-tight group-hover:text-[#1db954] transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        <p className="text-white/70 font-medium text-lg">
          {artist}
        </p>
        {genre && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 mt-3">
            <span className="text-sm text-white/60 font-medium">
              {genre}
            </span>
          </div>
        )}
      </div>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1db954]/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}