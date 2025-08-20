import {z} from "zod";
import {Message} from "@/components/message";
import {RatingFormWrapper} from "@/components/rating-form-wrapper";
import {AlbumService} from "../services/album";
import {appendToolMessages} from "./utils";

export const createShowRatingFormTool = (messages: any) => ({
  description: "Show the rating form for the current week's album",
  parameters: z.object({}),
  generate: async function* ({}: {}) {
    const result = AlbumService.getCurrentWeekAlbum();

    if (!result || result.isNomination) {
      appendToolMessages(messages, "showRatingForm", {}, "No current album found");
      return <Message role="assistant" content="No current album found to rate."/>;
    }

    const {album} = result;

    appendToolMessages(messages, "showRatingForm", {}, "Rating form displayed");

    return (
      <Message
        role="assistant"
        content={
          <RatingFormWrapper
            albumTitle={album.title}
            albumArtist={album.artist}
            albumId={album.id}
          />
        }
      />
    );
  },
});