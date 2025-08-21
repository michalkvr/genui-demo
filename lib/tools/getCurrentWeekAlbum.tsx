import {z} from "zod";
import {Message} from "@/components/message";
import {AlbumCard} from "@/components/album-card";
import {StatsCard} from "@/components/stats-card";
import {AlbumService} from "../services/album";
import {appendToolMessages} from "./utils";

// ========================================================================
// Fetch data, calculate stats, and return a message with the album details
// ========================================================================

export const createGetCurrentWeekAlbumTool = (messages: any) => ({
  description: "Get the current week's album (most recent by pickedAt or nomination)",
  parameters: z.object({}), // You can add call parameters if needed
  generate: async function* ({}: {}) {
    const result = AlbumService.getCurrentWeekAlbum();

    if (!result) {
      appendToolMessages(messages, "getCurrentWeekAlbum", {}, "No current week album found");
      return <Message role="assistant" content="No current week album found."/>;
    }

    const {album, isNomination} = result;

    let avg = null;
    let ratingsCount = 0;
    if (!isNomination) {
      const stats = AlbumService.getAlbumRatingsStats(album.id);
      avg = stats.avg;
      ratingsCount = stats.count;
    }

    appendToolMessages(messages, "getCurrentWeekAlbum", {}, album);

    return (
      <Message
        role="assistant"
        content={
          <div className="flex flex-col gap-4">
            <AlbumCard
              title={album.title}
              artist={album.artist}
              genre={album.genre}
              coverUrl={album.coverUrl}
            />
            {!isNomination && <StatsCard avg={avg} count={ratingsCount}/>}
          </div>
        }
      />
    );
  },
});