import {generateId} from "ai";
import {CoreMessage} from "ai";

// Helper function to handle tool call/result message appending
export const appendToolMessages = (messages: any, toolName: string, args: any, result: any) => {
  const toolCallId = generateId();
  
  messages.done([
    ...(messages.get() as CoreMessage[]),
    {
      role: "assistant",
      content: [
        {
          type: "tool-call",
          toolCallId,
          toolName,
          args,
        },
      ],
    },
    {
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolName,
          toolCallId,
          result,
        },
      ],
    },
  ]);
  
  return toolCallId;
};