interface StatsCardProps {
  avg: number | null;
  count: number;
}

export function StatsCard({avg, count}: StatsCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-zinc-800 dark:border-zinc-700">
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Rating Stats</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {avg !== null ? avg.toFixed(1) : "N/A"}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Average Rating</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {count}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Ratings</div>
          </div>
        </div>

        {avg !== null && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-4 h-4 ${
                  star <= avg
                    ? "text-yellow-400"
                    : "text-zinc-300 dark:text-zinc-600"
                }`}
              >
                ★
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}