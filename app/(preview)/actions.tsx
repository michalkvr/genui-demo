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
import {
  createGetAlbumRatingsTool, createGetAllCommentsTool, createGetAllRatingsTool,
  createGetCurrentWeekAlbumTool,
  createListBacklogTool, createShowNominationFormTool, createShowRatingFormTool,
} from "@/lib/tools";

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
    system: `You are a UI orchestrator for Audio Odyssey, an album discovery and rating app. Use tools to fetch data from JSON, then return React components to render the result.`,
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

    // =========================
    // Providing tools to the AI
    // =========================
    tools: {
      getCurrentWeekAlbum: createGetCurrentWeekAlbumTool(messages),
      listBacklog: createListBacklogTool(messages),
      getAlbumRatings: createGetAlbumRatingsTool(messages),
      showNominationForm: createShowNominationFormTool(messages),
      showRatingForm: createShowRatingFormTool(messages),
      getAllRatings: createGetAllRatingsTool(messages),
      getAllComments: createGetAllCommentsTool(messages),
    },
    // =========================
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
