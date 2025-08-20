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
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No albums found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          title={album.title}
          artist={album.artist}
          genre={album.genre}
          coverUrl={album.coverUrl}
        />
      ))}
    </div>
  );
}