import {Message, TextStreamMessage} from "@/components/message";
import {openai} from "@ai-sdk/openai";
import {CoreMessage, generateId} from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import {ReactNode} from "react";
import {createTools} from "@/lib/tools";

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    {role: "user", content: message},
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value}/>;

  const {value: stream} = await streamUI({
    model: openai("gpt-4o-mini"),
    system: `\
      You are a UI orchestrator for Audio Odyssey, an album discovery and rating app. Use tools to fetch data from JSON, then return React components to render the result. 

      Available components: AlbumCard, AlbumGrid, StatsCard, NominationForm, RatingForm, RatingsTable, CommentsList.

      Workflow:
      1. When users want to "nominate" an album, use showNominationForm tool
      2. When users want to "rate" an album or get a rating form, use showRatingForm tool  
      3. When users ask about current week's album, use getCurrentWeekAlbum
      4. When users ask about backlog or nominations, use listBacklog
      5. When users ask about ratings for a specific album, use getAlbumRatings
      6. When users ask for "all ratings" or want to see all album ratings, use getAllRatings tool
      7. When users ask for "comments" or want to see ratings with comments, use getAllComments tool
      
      Always respond with React components, never raw HTML or text-only responses.
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({content, done}) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          {role: "assistant", content},
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }
      return textComponent;
    },
    tools: createTools(messages),
  });

  return [<Message key={generateId()} role="user" content={message}/>, stream];
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
});
