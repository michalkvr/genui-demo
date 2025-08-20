import {z} from "zod";
import {Message} from "@/components/message";
import {NominationFormWrapper} from "@/components/nomination-form-wrapper";
import {appendToolMessages} from "./utils";

export const createShowNominationFormTool = (messages: any) => ({
  description: "Show the album nomination form when user wants to nominate an album",
  parameters: z.object({}),
  generate: async function* ({}: {}) {
    appendToolMessages(messages, "showNominationForm", {}, "Nomination form displayed");

    return (
      <Message
        role="assistant"
        content={<NominationFormWrapper/>}
      />
    );
  },
});