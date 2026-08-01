import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Key,
  Cpu,
  Trash2,
  Code,
  Copy,
  Check,
  RefreshCw,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  X,
  Bot,
  User,
  ArrowUp,
  Sliders,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import {
  PrimaryButton,
  SecondaryButton
} from "./hb/listing";

export interface VirtualKeyItem {
  id: string;
  alias: string;
  keyId: string;
  maskedKey: string;
  models: string[];
  team: string;
  status: "Active" | "Near Limit" | "Blocked";
}

export interface ModelItem {
  id: string;
  name: string;
  provider: string;
  badge?: string;
  maxTokens: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  durationMs?: number;
  liked?: boolean;
  disliked?: boolean;
}

// Assigned Mock Virtual Keys for Organization Admin
const MOCK_ASSIGNED_KEYS: VirtualKeyItem[] = [
  {
    id: "vk-101",
    alias: "AI Research Production",
    keyId: "512360370354...",
    maskedKey: "sk-litellm-512360370354••••••••••••••••••••••••",
    models: ["gpt-4o", "claude-3-5-sonnet", "gemini-2.5-flash"],
    team: "AI Research",
    status: "Active"
  },
  {
    id: "vk-102",
    alias: "CRM KEY (Sales Integration)",
    keyId: "098b9ac14c54...",
    maskedKey: "sk-litellm-098b9ac14c54••••••••••••••••••••••••",
    models: ["gpt-4o-mini", "gemini-1-5-pro"],
    team: "Sales Team",
    status: "Active"
  },
  {
    id: "vk-103",
    alias: "DevOps Test Key",
    keyId: "8f9a2b3c4d5e...",
    maskedKey: "sk-litellm-8f9a2b3c4d5e••••••••••••••••••••••••",
    models: ["gpt-4o", "llama-3-70b", "codex-mini-latest"],
    team: "DevOps Core",
    status: "Active"
  },
  {
    id: "vk-104",
    alias: "Full Access Gateway Key",
    keyId: "77a90bc1298a...",
    maskedKey: "sk-litellm-77a90bc1298a••••••••••••••••••••••••",
    models: ["All Models"],
    team: "Platform Core",
    status: "Active"
  }
];

// Available Models Catalog
const ALL_CATALOG_MODELS: ModelItem[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", badge: "Flagship", maxTokens: 128000 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", badge: "Fast", maxTokens: 128000 },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", badge: "Reasoning", maxTokens: 200000 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", badge: "Multimodal", maxTokens: 1000000 },
  { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", provider: "Google", badge: "Pro", maxTokens: 1000000 },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", badge: "Open Source", maxTokens: 8192 },
  { id: "codex-mini-latest", name: "Codex", provider: "OpenAI", badge: "Code", maxTokens: 16384 },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral", badge: "Fast", maxTokens: 32768 }
];

// Suggested Prompts Chips
const SUGGESTED_PROMPTS = [
  "Write a poem",
  "Summarize this text",
  "Explain quantum computing",
  "Generate SQL query",
  "Draft an email"
];

export default function PlaygroundManagement() {
  // Key & Model Selection State
  const [selectedKeyId, setSelectedKeyId] = useState<string>("vk-102"); // Default to CRM KEY as in user reference
  const [selectedModelId, setSelectedModelId] = useState<string>("gpt-4o-mini");

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [promptInput, setPromptInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Modals & Drawers
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [showGetCodeDrawer, setShowGetCodeDrawer] = useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = useState<"curl" | "python" | "node" | "java" | "csharp" | "go" | "php">("python");

  // Selected Virtual Key Object
  const selectedKey = useMemo(() => {
    return MOCK_ASSIGNED_KEYS.find((k) => k.id === selectedKeyId) || null;
  }, [selectedKeyId]);

  // Models Mapped to Selected Virtual Key
  const availableModels = useMemo(() => {
    if (!selectedKey) return [];
    if (selectedKey.models.includes("All Models")) {
      return ALL_CATALOG_MODELS;
    }
    return ALL_CATALOG_MODELS.filter((m) => selectedKey.models.includes(m.id));
  }, [selectedKey]);

  // Selected Model Object
  const selectedModel = useMemo(() => {
    return ALL_CATALOG_MODELS.find((m) => m.id === selectedModelId) || null;
  }, [selectedModelId]);

  // Reset model selection when Virtual Key changes
  useEffect(() => {
    if (availableModels.length > 0) {
      if (!availableModels.some((m) => m.id === selectedModelId)) {
        setSelectedModelId(availableModels[0].id);
      }
    } else {
      setSelectedModelId("");
    }
  }, [selectedKeyId, availableModels]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Prompt Submission Handler
  const handleSendPrompt = (textToSend?: string) => {
    const text = textToSend || promptInput;
    if (!text.trim() || !selectedKey || !selectedModel || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setPromptInput("");
    setIsGenerating(true);

    // Simulate AI Model Response
    const startTime = Date.now();
    setTimeout(() => {
      let aiResponseText = "";
      if (text.toLowerCase().includes("poem")) {
        aiResponseText = `In digital realms where models glow,\nThrough neural gates the prompt does flow.\nWith ${selectedModel.name} at your command,\nIntelligence answers across the land.`;
      } else if (text.toLowerCase().includes("quantum")) {
        aiResponseText = `Quantum computing harnesses quantum mechanics principles (superposition and entanglement) to process complex data exponentially faster than classical computers for specific algorithms.`;
      } else if (text.toLowerCase().includes("sql")) {
        aiResponseText = "```sql\nSELECT user_id, COUNT(*) as request_count, SUM(cost) as total_spend\nFROM gateway_request_logs\nWHERE status = 'Success'\nGROUP BY user_id\nORDER BY total_spend DESC;\n```";
      } else if (text.toLowerCase().includes("email")) {
        aiResponseText = `Subject: Project Update & Sync Request\n\nHi Team,\n\nI hope you're having a productive week. I'd like to schedule a brief sync to review our latest AI gateway performance metrics and model benchmarks.\n\nBest regards,\nJohn Doe`;
      } else {
        aiResponseText = `Here is the response generated by **${selectedModel.name}** via Virtual Key **${selectedKey.alias}**:\n\nProcessing prompt: "${text}"\n\nThe AI model has successfully evaluated your request and returned verified gateway completions.`;
      }

      const durationMs = Date.now() - startTime;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tokensUsed: {
          prompt: Math.round(text.length / 4) + 12,
          completion: Math.round(aiResponseText.length / 4) + 15,
          total: Math.round(text.length / 4) + Math.round(aiResponseText.length / 4) + 27
        },
        durationMs
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 1000);
  };

  // Keyboard shortcut (Shift + Enter for new line, Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  // Clear Chat Handler
  const handleConfirmClearChat = () => {
    setMessages([]);
    setShowClearModal(false);
    toast.success("Conversation history cleared.");
  };

  // Copy Text Helper
  const handleCopyText = (text: string, label: string = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  // Message Reaction Handlers
  const handleToggleLike = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, liked: !m.liked, disliked: false } : m))
    );
    toast.success("Feedback recorded.");
  };

  const handleToggleDislike = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, disliked: !m.disliked, liked: false } : m))
    );
    toast.info("Feedback recorded.");
  };

  // Code Snippet Generator
  const getGeneratedCode = (lang: string) => {
    const keyAlias = selectedKey?.alias || "AI Research Production";
    const maskedKey = selectedKey?.maskedKey || "sk-litellm-512360370354...";
    const modelName = selectedModel?.id || "gpt-4o";
    const promptText = messages.length > 0 ? messages[messages.length - 1].text : "Hello AI Gateway!";

    switch (lang) {
      case "python":
        return `import openai

client = openai.OpenAI(
    api_key="${maskedKey}", # Virtual Key: ${keyAlias}
    base_url="https://gateway.guardianlayer.com/v1"
)

response = client.chat.completions.create(
    model="${modelName}",
    messages=[
        {"role": "user", "content": "${promptText}"}
    ]
)

print(response.choices[0].message.content)`;

      case "node":
        return `import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "${maskedKey}", // Virtual Key: ${keyAlias}
  baseURL: "https://gateway.guardianlayer.com/v1"
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "${modelName}",
    messages: [
      { role: "user", content: "${promptText}" }
    ]
  });

  console.log(completion.choices[0].message.content);
}

main();`;

      case "curl":
        return `curl https://gateway.guardianlayer.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${maskedKey}" \\
  -d '{
    "model": "${modelName}",
    "messages": [
      {"role": "user", "content": "${promptText}"}
    ]
  }'`;

      case "java":
        return `import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;

public class PlaygroundClient {
    public static void main(String[] args) {
        OpenAiService service = new OpenAiService("${maskedKey}");
        
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("${modelName}")
            .messages(List.of(
                new ChatMessage("user", "${promptText}")
            ))
            .build();

        service.createChatCompletion(request).getChoices().forEach(System.out::println);
    }
}`;

      case "csharp":
        return `using OpenAI;

var api = new OpenAIClient("${maskedKey}");
var result = await api.ChatEndpoint.GetCompletionAsync(new ChatRequest(
    messages: new[] { new ChatMessage(Role.User, "${promptText}") },
    model: "${modelName}"
));

Console.WriteLine(result.FirstChoice.Message.Content);`;

      case "go":
        return `package main

import (
	"context"
	"fmt"
	openai "github.com/sashabaranov/go-openai"
)

func main() {
	config := openai.DefaultConfig("${maskedKey}")
	config.BaseURL = "https://gateway.guardianlayer.com/v1"
	client := openai.NewClientWithConfig(config)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "${modelName}",
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: "${promptText}"},
			},
		},
	)
	if err == nil {
		fmt.Println(resp.Choices[0].Message.Content)
	}
}`;

      case "php":
        return `<?php
require 'vendor/autoload.php';

$client = OpenAI::factory()
    ->withApiKey('${maskedKey}')
    ->withBaseUri('https://gateway.guardianlayer.com/v1')
    ->make();

$result = $client->chat()->create([
    'model' => '${modelName}',
    'messages' => [
        ['role' => 'user', 'content' => '${promptText}'],
    ],
]);

echo $result->choices[0]->message->content;`;

      default:
        return "";
    }
  };

  return (
    <div className="h-full flex-1 p-3 md:p-3 pb-3 flex flex-col overflow-hidden max-w-[1700px] w-full mx-auto animate-fadeIn">
      {/* -------------------- 1. COMPACT TOP TOOLBAR -------------------- */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2 shadow-2xs flex flex-wrap items-center justify-between gap-3 shrink-0 mb-2.5">
        {/* Left Side: Virtual Key & Model Dropdowns Aligned Horizontally */}
        <div className="flex flex-wrap items-center gap-4 flex-1 min-w-[280px]">
          {/* Virtual Key Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 whitespace-nowrap">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Virtual Key</span> <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedKeyId}
              onChange={(e) => setSelectedKeyId(e.target.value)}
              className="h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer max-w-[260px] truncate"
            >
              <option value="">-- Select Virtual Key --</option>
              {MOCK_ASSIGNED_KEYS.map((key) => (
                <option key={key.id} value={key.id}>
                  ▼ {key.alias} ({key.team})
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector (Depends on Virtual Key) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 whitespace-nowrap">
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>Model</span> <span className="text-rose-500">*</span>
            </label>
            <select
              disabled={!selectedKeyId || availableModels.length === 0}
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="h-8 px-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all disabled:opacity-50 cursor-pointer max-w-[240px] truncate"
            >
              {!selectedKeyId ? (
                <option value="">-- Select Virtual Key First --</option>
              ) : availableModels.length === 0 ? (
                <option value="">No models assigned</option>
              ) : (
                availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    ▼ {m.name} ({m.provider})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Right Side: Clear Chat & Get Code Actions */}
        <div className="flex items-center gap-2">
          <SecondaryButton
            icon={Trash2}
            onClick={() => setShowClearModal(true)}
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs py-1 px-3 h-8"
          >
            Clear Chat
          </SecondaryButton>

          <SecondaryButton
            icon={Code}
            onClick={() => setShowGetCodeDrawer(true)}
            className="text-xs py-1 px-3 h-8"
          >
            Get Code
          </SecondaryButton>
        </div>
      </div>

      {/* -------------------- 2. FULL-WIDTH CHAT WORKSPACE -------------------- */}
      <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs flex flex-col overflow-hidden min-h-0">
        {/* Scrollable Conversation Container */}
        <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-4 custom-scrollbar bg-neutral-50/20 dark:bg-neutral-950/20 flex flex-col">
          {/* EMPTY STATE */}
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center my-auto py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-500 shadow-xs">
                <Bot className="w-8 h-8" />
              </div>

              <div className="max-w-md space-y-1">
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  Start testing your AI models
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Select a Virtual Key and Model to begin testing prompt completions in real-time.
                </p>
              </div>

              {/* Validation Warnings */}
              {!selectedKeyId ? (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs px-3 py-2 rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please select a Virtual Key to unlock models.</span>
                </div>
              ) : !selectedModelId ? (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs px-3 py-2 rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please select a model.</span>
                </div>
              ) : null}

              {/* Suggested Prompts Chips */}
              <div className="pt-2 space-y-2">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Suggested Prompts
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => {
                        setPromptInput(prompt);
                        if (selectedKeyId && selectedModelId) {
                          handleSendPrompt(prompt);
                        }
                      }}
                      className="px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 transition-all shadow-2xs cursor-pointer"
                    >
                      ⚡ {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* CONVERSATION MESSAGES (75-85% MAX WIDTH FOR AI RESPONSES) */
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs animate-fadeIn ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`rounded-xl p-3.5 space-y-2 shadow-2xs ${
                    msg.sender === "user"
                      ? "max-w-[75%] bg-amber-500 text-white font-medium rounded-tr-xs"
                      : "max-w-[85%] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-xs"
                  }`}
                >
                  {/* Assistant Header Badge */}
                  {msg.sender === "assistant" && (
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {selectedModel?.name}
                      </span>
                      {msg.tokensUsed && (
                        <span className="font-mono text-[10px]">
                          {msg.tokensUsed.total} tokens ({msg.durationMs}ms)
                        </span>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Assistant Message Actions */}
                  {msg.sender === "assistant" && (
                    <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.text, "Response copied!")}
                          className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                          title="Copy Response"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleLike(msg.id)}
                          className={`p-1 transition-colors ${msg.liked ? "text-emerald-500 font-bold" : "hover:text-neutral-700"}`}
                          title="Like Response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDislike(msg.id)}
                          className={`p-1 transition-colors ${msg.disliked ? "text-rose-500 font-bold" : "hover:text-neutral-700"}`}
                          title="Dislike Response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSendPrompt(messages[messages.length - 2]?.text || "Regenerate")}
                        className="hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center font-bold shrink-0 shadow-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex gap-3 text-xs justify-start animate-fadeIn">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                <Bot className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-2xs text-neutral-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                <span className="font-semibold text-xs text-neutral-700 dark:text-neutral-300">
                  {selectedModel?.name || "Model"} is generating completions...
                </span>
              </div>
            </div>
          )}

          {/* 16px Bottom breathing room above composer */}
          <div ref={chatBottomRef} className="h-4 shrink-0" />
        </div>

        {/* -------------------- 3. FIXED PROMPT COMPOSER -------------------- */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0 space-y-1.5">
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              title="Attach Document / Media (Future)"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!selectedKeyId || !selectedModelId}
              placeholder={
                !selectedKeyId
                  ? "Please select a Virtual Key first..."
                  : !selectedModelId
                  ? "Please select a model..."
                  : "Ask your model anything... (Shift + Enter for new line)"
              }
              rows={1}
              className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none min-h-[42px] max-h-[140px] disabled:opacity-50 cursor-text"
            />

            <button
              type="button"
              onClick={() => handleSendPrompt()}
              disabled={!selectedKeyId || !selectedModelId || !promptInput.trim() || isGenerating}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
              title="Send Message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center text-[10px] text-neutral-400 font-mono">
            <span>Enter to send • Shift + Enter for newline</span>
          </div>
        </div>
      </div>

      {/* -------------------- CLEAR CHAT CONFIRMATION MODAL -------------------- */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Clear this conversation?</h3>
                <p className="text-xs text-neutral-500 mt-0.5">This action will clear all current messages in the Playground.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <SecondaryButton onClick={() => setShowClearModal(false)}>
                Cancel
              </SecondaryButton>
              <button
                type="button"
                onClick={handleConfirmClearChat}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- GET CODE RIGHT SLIDE-OVER DRAWER -------------------- */}
      {showGetCodeDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 w-full max-w-xl h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-950">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Integration Code Snippet
                </h3>
              </div>
              <button
                onClick={() => setShowGetCodeDrawer(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Selection Tabs */}
            <div className="px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold bg-neutral-50/30">
              {(["python", "node", "curl", "java", "csharp", "go", "php"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setCodeLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                    codeLanguage === lang
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {lang === "csharp" ? "C#" : lang === "node" ? "Node.js" : lang}
                </button>
              ))}
            </div>

            {/* Drawer Body — Code Viewer */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs custom-scrollbar">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium text-xs">
                  Generated snippet using current Virtual Key & Model parameters:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(getGeneratedCode(codeLanguage), "Code snippet copied!")}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              <div className="p-4 bg-neutral-950 text-amber-300 font-mono text-xs rounded-2xl border border-neutral-800 shadow-inner overflow-x-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {getGeneratedCode(codeLanguage)}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end bg-neutral-50 dark:bg-neutral-950">
              <SecondaryButton onClick={() => setShowGetCodeDrawer(false)}>
                Close
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
