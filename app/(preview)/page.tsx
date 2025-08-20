"use client";

import {ReactNode, useRef, useState} from "react";
import {useActions} from "ai/rsc";
import {Message} from "@/components/message";
import {useScrollToBottom} from "@/components/use-scroll-to-bottom";
import {motion} from "framer-motion";
import {MasonryIcon, VercelIcon} from "@/components/icons";
import Link from "next/link";

export default function Home() {
  const {sendMessage} = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "Show this",
      label: "week's album with artist and average rating",
      action: "Show this week's album with artist and average rating"
    },
    {title: "List albums", label: "in the backlog", action: "List albums in the backlog"},
    {
      title: "Summarize",
      label: "ratings for current album",
      action: "Summarize ratings for current album",
    },
    {
      title: "Show me",
      label: "all album ratings",
      action: "Show me all album ratings",
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

      {/* Main content area */}
      <div className="flex-1 flex flex-row justify-center px-4 lg:px-8">
        <div className="w-full max-w-6xl flex flex-col gap-8 pt-8 pb-20">
          {/* Messages container */}
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-6 min-h-[400px] overflow-y-auto"
          >
            {messages.length === 0 && (
              <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto text-center backdrop-blur-lg">
                  <div className="flex flex-row justify-center gap-4 items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#1db954] flex items-center justify-center">
                      <VercelIcon size={24} color="white"/>
                    </div>
                    <span className="text-2xl font-bold text-white">×</span>
                    <div
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <MasonryIcon color="white"/>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Welcome to Audio Odyssey
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Your AI-powered music discovery companion. Explore albums, get personalized recommendations,
                    and dive deep into your musical journey with intelligent conversations.
                  </p>
                </div>
              </motion.div>
            )}
            {messages.map((message) => message)}
            <div ref={messagesEndRef}/>
          </div>

          {/* Suggested actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full pb-12">
            {messages.length === 0 &&
              suggestedActions.map((action, index) => (
                <motion.div
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.1 * index, type: "spring", stiffness: 100}}
                  key={index}
                >
                  <button
                    onClick={async () => {
                      setMessages((messages) => [
                        ...messages,
                        <Message
                          key={messages.length}
                          role="user"
                          content={action.action}
                        />,
                      ]);
                      const response: ReactNode = await sendMessage(
                        action.action,
                      );
                      setMessages((messages) => [...messages, response]);
                    }}
                    className="w-full text-left glass-effect rounded-xl p-6 hover-lift group cursor-pointer border-0 bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-[#1db954] group-hover:animate-pulse"></div>
                      <div className="flex-1">
                        <span
                          className="block font-semibold text-white text-lg group-hover:text-[#1db954] transition-colors">
                          {action.title}
                        </span>
                        <span className="block text-white/60 mt-1">
                          {action.label}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
          </div>

          {/* Input form */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
            <form
              className="relative"
              onSubmit={async (event) => {
                event.preventDefault();

                setMessages((messages) => [
                  ...messages,
                  <Message key={messages.length} role="user" content={input}/>,
                ]);
                setInput("");

                const response: ReactNode = await sendMessage(input);
                setMessages((messages) => [...messages, response]);
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
