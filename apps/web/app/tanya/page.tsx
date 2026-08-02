"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ChatHeader } from "@/components/tanya/ChatHeader";
import { BubbleUser } from "@/components/tanya/BubbleUser";
import { BubbleAssistant } from "@/components/tanya/BubbleAssistant";
import { BubbleTyping } from "@/components/tanya/BubbleTyping";
import { InputBar } from "@/components/tanya/InputBar";
import { WelcomeSuggestions } from "@/components/tanya/WelcomeSuggestions";
import { generateMockAnswer } from "@/components/tanya/mock-answers";
import type { Entry } from "@/lib/mock-data";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Entry[];
  createdAt: string;
};

const WELCOME_MSG: Msg = {
  id: "welcome",
  role: "assistant",
  content:
    "Halo! Aku Si Lestari. Tanya aja apa saja tentang bahasa daerah, aku bantu cari jawaban dari kamus.",
  createdAt: new Date().toISOString(),
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function TanyaPage() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const onlyWelcome = messages.length === 1 && messages[0].id === "welcome";

  const scrollToBottom = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "end",
      });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock delay 1.5s (Fase 5 diganti fetch /api/chat)
    await new Promise((r) => setTimeout(r, 1500));

    const { answer, sources } = generateMockAnswer(text);
    const assistantMsg: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: answer,
      sources,
      createdAt: new Date().toISOString(),
    };

    setMessages((m) => [...m, assistantMsg]);
    setIsTyping(false);
  };

  const handleReset = () => {
    setMessages([{ ...WELCOME_MSG, createdAt: new Date().toISOString() }]);
    setInput("");
    setIsTyping(false);
  };

  const handleSelectSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex min-h-screen flex-col bg-sl-cream-100">
      <Navbar />
      <ChatHeader onReset={handleReset} />

      <main
        role="log"
        aria-label="Percakapan dengan Si Lestari"
        aria-live="polite"
        className="flex-1"
      >
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
          {messages.map((msg) =>
            msg.role === "user" ? (
              <BubbleUser
                key={msg.id}
                content={msg.content}
                time={formatTime(msg.createdAt)}
              />
            ) : (
              <BubbleAssistant
                key={msg.id}
                content={msg.content}
                sources={msg.sources}
                time={
                  msg.id === "welcome" ? undefined : formatTime(msg.createdAt)
                }
              />
            ),
          )}

          {onlyWelcome && !isTyping && (
            <WelcomeSuggestions onSelect={handleSelectSuggestion} />
          )}

          {isTyping && <BubbleTyping />}

          <div ref={scrollAnchorRef} aria-hidden />
        </div>
      </main>

      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isTyping}
      />
    </div>
  );
}
