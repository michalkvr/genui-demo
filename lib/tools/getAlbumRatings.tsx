import {z} from "zod";
import {Message} from "@/components/message";
import {StatsCard} from "@/components/stats-card";
import {AlbumService} from "../services/album";
import {appendToolMessages} from "./utils";

export const createGetAlbumRatingsTool = (messages: any) => ({
  description: "Get ratings overview for a specific album",
  parameters: z.object({
    albumId: z.string(),
  }),
  generate: async function* ({albumId}: { albumId: string }) {
    const result = AlbumService.getAlbumRatings(albumId);
    
    appendToolMessages(messages, "getAlbumRatings", {albumId}, result);

    return (
      <Message
        role="assistant"
        content={<StatsCard avg={result.avg} count={result.count}/>}
      />
    );
  },
});