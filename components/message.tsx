"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full max-w-4xl mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center flex-shrink-0 shadow-lg">
        <BotIcon size={20} color="white" />
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="glass-effect rounded-2xl rounded-tl-md px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
          <div className="text-white flex flex-col gap-4 leading-relaxed">
            <Markdown>{text}</Markdown>
          </div>
        </div>
        <div className="text-white/40 text-xs px-2">
          Audio Odyssey Assistant
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  const isUser = role === "user";
  
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
        isUser 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
          : 'bg-[#1db954]'
      }`}>
        {isUser ? <UserIcon size={20} color="white" /> : <BotIcon size={20} color="white" />}
      </div>

      <div className={`flex flex-col gap-2 flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`glass-effect px-6 py-4 backdrop-blur-sm border shadow-xl max-w-[85%] ${
          isUser 
            ? 'rounded-2xl rounded-tr-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/30' 
            : 'rounded-2xl rounded-tl-md bg-white/10 border-white/20'
        }`}>
          <div className="text-white flex flex-col gap-4 leading-relaxed">
            {typeof content === 'string' ? content : content}
          </div>
        </div>
        <div className={`text-white/40 text-xs px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'You' : 'Audio Odyssey Assistant'}
        </div>
      </div>
    </motion.div>
  );
};
