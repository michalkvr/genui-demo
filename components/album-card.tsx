interface AlbumCardProps {
  title: string;
  artist: string;
  genre?: string;
  coverUrl?: string;
}

export function AlbumCard({title, artist, genre, coverUrl}: AlbumCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3 bg-white dark:bg-zinc-800 dark:border-zinc-700">
      {coverUrl && (
        <div className="aspect-square rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-700">
          <img
            src={coverUrl}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{artist}</p>
        {genre && (
          <span className="text-sm text-zinc-500 dark:text-zinc-500">{genre}</span>
        )}
      </div>
    </div>
  );
}