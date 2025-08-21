import {z} from "zod";
import {Message} from "@/components/message";
import {NominationFormWrapper} from "@/components/nomination-form-wrapper";
import {appendToolMessages} from "./utils";

export const createShowNominationFormTool = (messages: any) => ({
  description: "Show the album nomination form when user wants to nominate an album. Use this when the user asks to nominate an album that was discussed in the conversation.",
  parameters: z.object({
    title: z.string().optional().describe("Pre-fill the album title based on conversation context"),
    artist: z.string().optional().describe("Pre-fill the artist name based on conversation context"),
    genre: z.string().optional().describe("Pre-fill the genre based on conversation context"),
    coverUrl: z.string().optional().describe("Pre-fill the cover image URL if available"),
  }),
  generate: async function* ({title, artist, genre, coverUrl}: {
    title?: string;
    artist?: string;
    genre?: string;
    coverUrl?: string;
  }) {
    appendToolMessages(messages, "showNominationForm", {title, artist, genre, coverUrl}, "Showing nomination form with pre-filled data");

    return (
      <Message
        role="assistant"
        content={<NominationFormWrapper initialData={{title, artist, genre, coverUrl}} />}
      />
    );
  },
});