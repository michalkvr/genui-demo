import {z} from "zod";
import {Message} from "@/components/message";
import {AlbumGrid} from "@/components/album-grid";
import {AlbumService} from "../services/album";
import {appendToolMessages} from "./utils";

export const createListBacklogTool = (messages: any) => ({
  description: "List albums in the backlog",
  parameters: z.object({
    limit: z.number().optional(),
  }),
  generate: async function* ({limit}: { limit?: number }) {
    const backlog = AlbumService.getBacklogAlbums(limit);

    appendToolMessages(messages, "listBacklog", {limit}, backlog);

    return (
      <Message
        role="assistant"
        content={<AlbumGrid albums={backlog}/>}
      />
    );
  },
});