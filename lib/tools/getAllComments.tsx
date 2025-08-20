import {z} from "zod";
import {Message} from "@/components/message";
import {CommentsList} from "@/components/comments-list";
import {AlbumService} from "../services/album";
import {appendToolMessages} from "./utils";

export const createGetAllCommentsTool = (messages: any) => ({
  description: "Get all album ratings with comments and stars displayed in a detailed format",
  parameters: z.object({}),
  generate: async function* ({}: {}) {
    const {ratings, albums} = AlbumService.getAllComments();
    
    appendToolMessages(messages, "getAllComments", {}, "All comments and ratings displayed");

    return (
      <Message
        role="assistant"
        content={<CommentsList ratings={ratings} albums={albums}/>}
      />
    );
  },
});