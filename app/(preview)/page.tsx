"use client";

import {ReactNode, useRef, useState} from "react";
import {useActions, useUIState} from "ai/rsc";
import {Message} from "@/components/message";
import {useScrollToBottom} from "@/components/use-scroll-to-bottom";
import {motion} from "framer-motion";
import {MasonryIcon, VercelIcon} from "@/components/icons";
import Link from "next/link";
import ratings from "@/data/ratings.json";
import albums from "@/data/albums.json";
import {CommentsList} from "@/components/comments-list";

export default function Home() {
  const {sendMessage} = useActions();
  const [messages, setMessages] = useUIState();

  const [input, setInput] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "Current Album",
      label: "Show this week's pick",
      action: "Show this week's album with artist and average rating"
    },
    {
      title: "Nominate",
      label: "Add album to consideration",
      action: "I want to nominate an album"
    },
    {
      title: "Rate Album",
      label: "Rate current week's album",
      action: "I want to rate the current album"
    },
    {
      title: "Backlog",
      label: "View pending nominations",
      action: "List albums in the backlog"
    },
    {
      title: "All Ratings",
      label: "View ratings table",
      action: "Show me all album ratings"
    },
    {
      title: "Comments",
      label: "View ratings with comments",
      action: "Show me all ratings with comments"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191414] via-[#121212] to-[#0d0d0d] flex flex-col">
      {/* Header with gradient accent */}
      <div className="gradient-bg h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight"
          >
            Audio Odyssey
          </motion.h1>
          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="text-xl md:text-2xl text-white/80 font-light"
          >
            Discover your next favorite album
          </motion.p>
        </div>
      </div>

      {/* New Conversation Button */}
      {messages.length > 0 && (
        <div className="fixed top-6 right-6 z-10">
          <button
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
            className="glass-effect rounded-xl px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                    fill="currentColor"/>
            </svg>
            New Chat
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-row justify-center px-4 lg:px-8">
        <div className="w-full max-w-6xl flex flex-col gap-8 pt-8 pb-20">
          {/* Messages container */}
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-6 min-h-[400px] overflow-y-auto"
          >
            {messages.length === 0 ? (
              /* Centered hint cards when chat is empty */
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl w-full">
                  {suggestedActions.map((action, index) => (
                    <motion.div
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: 0.05 * index, type: "spring", stiffness: 100}}
                      key={index}
                    >
                      <button
                        onClick={async () => {
                          const newMessages = await sendMessage(action.action);
                          setMessages([...messages, ...newMessages]);
                        }}
                        className="w-full text-left glass-effect rounded-lg p-4 hover-lift group cursor-pointer border-0 bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1db954] group-hover:animate-pulse"></div>
                          <div className="flex-1 min-w-0">
                            <span
                              className="block font-semibold text-white text-sm group-hover:text-[#1db954] transition-colors truncate">
                              {action.title}
                            </span>
                            <span className="block text-white/60 text-xs mt-0.5 truncate">
                              {action.label}
                            </span>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message: any) => message)}
                <div ref={messagesEndRef}/>
              </>
            )}
          </div>

          {/* Input form */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
            <form
              className="relative"
              onSubmit={async (event) => {
                event.preventDefault();
                const currentInput = input;
                setInput("");

                const newMessages = await sendMessage(currentInput);
                setMessages([...messages, ...newMessages]);
              }}
            >
              <div className="glass-effect rounded-full p-2 bg-black/20 backdrop-blur-lg border border-white/20">
                <input
                  ref={inputRef}
                  className="w-full bg-transparent rounded-full px-6 py-4 text-white placeholder-white/50 outline-none text-lg"
                  placeholder="Ask about albums, ratings, or discover new music..."
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#1db954] rounded-full flex items-center justify-center hover:bg-[#1ed760] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="white"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
