import {z} from "zod";
import {Message} from "@/components/message";
import {RatingsTable} from "@/components/ratings-table";
import {AlbumService} from "../services/album";
import {appendToolMessages} from "./utils";

export const createGetAllRatingsTool = (messages: any) => ({
  description: "Get all album ratings displayed in a table format",
  parameters: z.object({}),
  generate: async function* ({}: {}) {
    const {ratings, albums} = AlbumService.getAllRatings();
    
    appendToolMessages(messages, "getAllRatings", {}, "All ratings table displayed");

    return (
      <Message
        role="assistant"
        content={<RatingsTable ratings={ratings} albums={albums}/>}
      />
    );
  },
});