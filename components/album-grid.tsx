import { AlbumCard } from "./album-card";

interface Album {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  coverUrl?: string;
}

interface AlbumGridProps {
  albums: Album[];
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="glass-effect rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3H22V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Albums Found</h3>
          <p className="text-white/60">
            Your musical journey starts here. Try exploring some albums!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {albums.map((album, index) => (
          <div
            key={album.id}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <AlbumCard
              title={album.title}
              artist={album.artist}
              genre={album.genre}
              coverUrl={album.coverUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}