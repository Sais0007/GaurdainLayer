/**
 * MOCK DATA FOR AI GATEWAY - REQUEST LOGS & OBSERVABILITY
 */

export interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  originalLLMCost: number;
  markup: number;
  discount: number;
  finalCost: number;
  currency: string;
  totalCost: number;
}

export interface MetricData {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  timeToFirstToken?: number; // seconds
  duration: number; // seconds
  retries: number;
  cacheStatus: 'Hit' | 'Miss' | 'None';
  startTime: string;
  endTime: string;
  latencyMs: number;
}

export interface ErrorDetail {
  code: string | number;
  message: string;
  type: string;
  traceback?: string;
  providerResponse?: string;
  gatewayResponse?: string;
  httpStatus?: number;
}

export interface TimelineEvent {
  id: string;
  step: string;
  timestamp: string;
  offsetSeconds: number;
  status: 'completed' | 'failed' | 'pending';
  detail?: string;
}

export interface RequestLogItem {
  id: string; // Request ID
  sessionId: string;
  timestamp: string; // ISO string
  type: 'LLM' | 'Embedding' | 'Image' | 'Audio' | 'Search Tool';
  callType: string; // e.g. acompletion, chat.completions
  status: 'Success' | 'Failure' | 'Warning' | 'Pending';
  cost: number;
  duration: number; // seconds
  ttft?: number; // Time to first token in seconds
  teamName: string;
  teamId: string;
  keyHash: string;
  keyAlias: string;
  model: string;
  modelId: string;
  provider: string;
  organization: string;
  environment: 'default' | 'production' | 'development' | 'testing';
  apiBaseUrl: string;
  ipAddress: string;
  endUser: string;
  requestType: string;
  tags: string[];
  metrics: MetricData;
  costBreakdown: CostBreakdown;
  requestPayload: any;
  responsePayload: any;
  metadataPayload: any;
  error?: ErrorDetail;
  timeline: TimelineEvent[];
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface DeletedKeyItem {
  id: string;
  keyAlias: string;
  keyHash: string;
  deletedBy: string;
  deletedAt: string;
  team: string;
  reason: string;
}

export interface DeletedTeamItem {
  id: string;
  teamName: string;
  teamId: string;
  deletedBy: string;
  deletedAt: string;
  membersCount: number;
  reason: string;
}

export const mockRequestLogs: RequestLogItem[] = [
  {
    id: "90502305-5027-43d2-bc40-e780e788014d",
    sessionId: "5cd44b3c-5027-43d2-bc40-e780e788014d",
    timestamp: "2026-07-31T14:20:48.502Z",
    type: "LLM",
    callType: "acompletion",
    status: "Failure",
    cost: 0.000000,
    duration: 0.00,
    teamName: "-",
    teamId: "-",
    keyHash: "302511b783c80cd2s7cc1ed+0ab4125ce473b48c380810f348b145d822c5b7",
    keyAlias: "Test Key",
    model: "gemini/gemini-2.5-flash",
    modelId: "73102c3a-0804-434d-8b40-e780e788014d",
    provider: "gemini",
    organization: "HB Enterprise",
    environment: "default",
    apiBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    ipAddress: "127.0.0.1",
    endUser: "alex.dev@hb.com",
    requestType: "acompletion",
    tags: [
      "0: User-Agent: Mozilla",
      "1: User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
    ],
    metrics: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cost: 0.000000,
      duration: 0.00,
      retries: 0,
      cacheStatus: "Miss",
      startTime: "2026-07-31T14:20:48.502Z",
      endTime: "2026-07-31T14:20:48.502Z",
      latencyMs: 0
    },
    costBreakdown: {
      inputCost: 0.000000,
      outputCost: 0.000000,
      originalLLMCost: 0.000000,
      markup: 0.00,
      discount: 0.00,
      finalCost: 0.000000,
      currency: "USD",
      totalCost: 0.000000
    },
    requestPayload: {
      model: "gemini/gemini-2.5-flash",
      messages: [
        { role: "user", content: "Synthesize latest security policy logs for API gateway." }
      ],
      stream: false,
      temperature: 0.7
    },
    responsePayload: null,
    metadataPayload: {
      status: "failure",
      max_retries: null,
      batch_models: null,
      usage_object: null,
      user_api_key: "302511b783c80cd2s7cc1ed+0ab4125ce473b48c380810f348b145d822c5b7",
      cost_breakdown: null,
      litellm_call_id: "90502305-5027-43d2-bc40-e780e788014d",
      eval_information: null,
      attempted_retries: null,
      error_information: {
        traceback: "File \"/var/www/html/litellm_git/guardian_layer/litellm/proxy/auth/user_api_key_auth.py\", line 1825, in user_api_key_auth_builder\n    raise ProxyException(\n",
        error_code: "401",
        error_class: "ProxyException",
        llm_provider: "gemini"
      }
    },
    error: {
      code: "401",
      message: "Authentication Error - Expired Key. Key Expiry time 2026-07-31 06:42:10.104000+00:00 and current time 2026-07-31 08:50:48.350647+00:00",
      type: "ProxyException",
      traceback: "File \"/var/www/html/litellm_git/guardian_layer/litellm/proxy/auth/user_api_key_auth.py\", line 1825, in user_api_key_auth_builder\n    raise ProxyException(error_message=f\"Authentication Error - Expired Key.\", code=401)",
      providerResponse: "HTTP 401 Unauthorized - Key expired",
      gatewayResponse: "Gateway Key Validation Failed: Expired token",
      httpStatus: 401
    },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "14:20:48.502", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Gateway Validation", timestamp: "14:20:48.502", offsetSeconds: 0.00, status: "failed", detail: "Expired Key 401" }
    ]
  },
  {
    id: "3qdpatv1H-aCG8UPX8HfwQM",
    sessionId: "ad5bcd4e-0823-4412-8823-3qdpatv1H-aCG",
    timestamp: "2026-07-29T12:42:30.154Z",
    type: "LLM",
    callType: "acompletion",
    status: "Success",
    cost: 0.000091,
    duration: 1.46,
    ttft: 1.44,
    teamName: "Sales Team",
    teamId: "team-sales-101",
    keyHash: "098b9ac14c549921c...",
    keyAlias: "CRM KEY",
    model: "gemini/gemini-2.5-flash",
    modelId: "73102c3a-0804-434d-8b40-e780e788014d",
    provider: "gemini",
    organization: "HB Enterprise",
    environment: "default",
    apiBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    ipAddress: "127.0.0.1",
    endUser: "sarah.connor@hb.com",
    requestType: "acompletion",
    tags: [
      "0: User-Agent: Mozilla",
      "1: User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
    ],
    metrics: {
      promptTokens: 3,
      completionTokens: 36,
      totalTokens: 39,
      cost: 0.000091,
      timeToFirstToken: 1.439,
      duration: 1.462,
      retries: 0,
      cacheStatus: "Miss",
      startTime: "2026-07-29T12:42:30.154Z",
      endTime: "2026-07-29T12:42:31.616Z",
      latencyMs: 1462
    },
    costBreakdown: {
      inputCost: 0.00000090,
      outputCost: 0.00009000,
      originalLLMCost: 0.00009090,
      markup: 0.00,
      discount: 0.00,
      finalCost: 0.00009090,
      currency: "USD",
      totalCost: 0.00009090
    },
    requestPayload: {
      model: "gemini/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an AI assistant for enterprise analytics." },
        { role: "user", content: "Summarize quarterly pipeline growth in 2 sentences." }
      ],
      temperature: 0.2
    },
    responsePayload: {
      id: "3qdpatv1H-aCG8UPX8HfwQM",
      object: "chat.completion",
      created: 1785328950,
      model: "gemini-2.5-flash",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Quarterly pipeline growth increased by 28% quarter-over-quarter driven primarily by enterprise expansion in North America. Key conversion rates improved by 4.2% following AI gateway deployment."
          },
          finish_reason: "stop"
        }
      ],
      usage: {
        prompt_tokens: 3,
        completion_tokens: 36,
        total_tokens: 39
      }
    },
    metadataPayload: {
      status: "success",
      user_api_key: "098b9ac14c549921c...",
      user_id: "usr-4412b",
      team_id: "team-sales-101",
      llm_provider: "gemini"
    },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "12:42:30.154", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Gateway Validation", timestamp: "12:42:30.166", offsetSeconds: 0.012, status: "completed" },
      { id: "t3", step: "Provider Call", timestamp: "12:42:30.177", offsetSeconds: 0.023, status: "completed" },
      { id: "t4", step: "Response Received", timestamp: "12:42:31.593", offsetSeconds: 1.439, status: "completed" },
      { id: "t5", step: "Completed", timestamp: "12:42:31.616", offsetSeconds: 1.462, status: "completed" }
    ]
  },
  {
    id: "chatcmpl-R6Ht101a91",
    sessionId: "f109a06c-9182-4122-a109-f109a06c9182",
    timestamp: "2026-07-27T21:08:19.000Z",
    type: "LLM",
    callType: "chat.completions",
    status: "Success",
    cost: 0.000007,
    duration: 1.72,
    ttft: 1.72,
    teamName: "litellm-internal-he...",
    teamId: "team-litellm-01",
    keyHash: "lite11m-inter...",
    keyAlias: "litellm-internal-he...",
    model: "gpt-4o-mini",
    modelId: "gpt-4o-mini-2026-07-18",
    provider: "OpenAI",
    organization: "HB Enterprise",
    environment: "default",
    apiBaseUrl: "https://api.openai.com/v1",
    ipAddress: "192.168.1.102",
    endUser: "john.doe@company.com",
    requestType: "chat.completions",
    tags: ["Env: default", "App: Gateway Core"],
    metrics: {
      promptTokens: 14,
      completionTokens: 28,
      totalTokens: 42,
      cost: 0.000007,
      timeToFirstToken: 1.72,
      duration: 1.72,
      retries: 0,
      cacheStatus: "Hit",
      startTime: "2026-07-27T21:08:19.000Z",
      endTime: "2026-07-27T21:08:20.720Z",
      latencyMs: 1720
    },
    costBreakdown: {
      inputCost: 0.000002,
      outputCost: 0.000005,
      originalLLMCost: 0.000007,
      markup: 0.00,
      discount: 0.00,
      finalCost: 0.000007,
      currency: "USD",
      totalCost: 0.000007
    },
    requestPayload: { model: "gpt-4o-mini", messages: [{ role: "user", content: "Ping health check." }] },
    responsePayload: { choices: [{ message: { role: "assistant", content: "Pong. All systems operational." } }] },
    metadataPayload: { status: "success", provider: "openai" },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "21:08:19.000", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Completed", timestamp: "21:08:20.720", offsetSeconds: 1.72, status: "completed" }
    ]
  },
  {
    id: "chatcmpl-R6Hi8812a",
    sessionId: "441b4cfb-9a12-4211-b4cf-441b4cfb9a12",
    timestamp: "2026-07-27T21:09:06.000Z",
    type: "LLM",
    callType: "chat.completions",
    status: "Success",
    cost: 0.000012,
    duration: 17.64,
    teamName: "litellm-internal-he...",
    teamId: "team-litellm-01",
    keyHash: "lite11m-inter...",
    keyAlias: "litellm-internal-he...",
    model: "gpt-4o-mini",
    modelId: "gpt-4o-mini-2026-07-18",
    provider: "OpenAI",
    organization: "HB Enterprise",
    environment: "default",
    apiBaseUrl: "https://api.openai.com/v1",
    ipAddress: "192.168.1.102",
    endUser: "john.doe@company.com",
    requestType: "chat.completions",
    tags: ["Long Execution", "Batch Task"],
    metrics: {
      promptTokens: 120,
      completionTokens: 480,
      totalTokens: 600,
      cost: 0.000012,
      duration: 17.64,
      retries: 0,
      cacheStatus: "Miss",
      startTime: "2026-07-27T21:09:06.000Z",
      endTime: "2026-07-27T21:09:23.640Z",
      latencyMs: 17640
    },
    costBreakdown: {
      inputCost: 0.000003,
      outputCost: 0.000009,
      originalLLMCost: 0.000012,
      markup: 0.00,
      discount: 0.00,
      finalCost: 0.000012,
      currency: "USD",
      totalCost: 0.000012
    },
    requestPayload: { model: "gpt-4o-mini", messages: [{ role: "user", content: "Generate report schema." }] },
    responsePayload: { choices: [{ message: { role: "assistant", content: "JSON Schema created." } }] },
    metadataPayload: { status: "success" },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "21:09:06.000", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Completed", timestamp: "21:09:23.640", offsetSeconds: 17.64, status: "completed" }
    ]
  },
  {
    id: "chatcmpl-R6Us9921b",
    sessionId: "b46679f1-c699-4211-b466-b46679f1c699",
    timestamp: "2026-07-27T21:19:51.000Z",
    type: "LLM",
    callType: "chat.completions",
    status: "Success",
    cost: 0.000046,
    duration: 1.71,
    ttft: 1.70,
    teamName: "Sales Team",
    teamId: "team-sales-101",
    keyHash: "de32895d2e7931...",
    keyAlias: "CRM KEY",
    model: "gpt-4o-mini",
    modelId: "gpt-4o-mini-2026-07-18",
    provider: "OpenAI",
    organization: "HB Enterprise",
    environment: "production",
    apiBaseUrl: "https://api.openai.com/v1",
    ipAddress: "10.0.4.12",
    endUser: "sarah.connor@hb.com",
    requestType: "chat.completions",
    tags: ["Sales CRM", "Production"],
    metrics: {
      promptTokens: 45,
      completionTokens: 110,
      totalTokens: 155,
      cost: 0.000046,
      timeToFirstToken: 1.70,
      duration: 1.71,
      retries: 0,
      cacheStatus: "Miss",
      startTime: "2026-07-27T21:19:51.000Z",
      endTime: "2026-07-27T21:19:52.710Z",
      latencyMs: 1710
    },
    costBreakdown: {
      inputCost: 0.000010,
      outputCost: 0.000036,
      originalLLMCost: 0.000046,
      markup: 0.00,
      discount: 0.00,
      finalCost: 0.000046,
      currency: "USD",
      totalCost: 0.000046
    },
    requestPayload: { model: "gpt-4o-mini", messages: [{ role: "user", content: "Draft follow up email." }] },
    responsePayload: { choices: [{ message: { role: "assistant", content: "Email draft generated." } }] },
    metadataPayload: { status: "success" },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "21:19:51.000", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Completed", timestamp: "21:19:52.710", offsetSeconds: 1.71, status: "completed" }
    ]
  },
  {
    id: "cff2c48f-2599-4712-b2b0-cff2c48f2599",
    sessionId: "b2b00a69-f199-4211-b2b0-b2b00a69f199",
    timestamp: "2026-07-27T21:22:23.000Z",
    type: "LLM",
    callType: "chat.completions",
    status: "Failure",
    cost: 0.000000,
    duration: 0.00,
    teamName: "-",
    teamId: "-",
    keyHash: "0e1b1c4b335b77...",
    keyAlias: "Ravi key",
    model: "gpt-4o-mini",
    modelId: "gpt-4o-mini",
    provider: "OpenAI",
    organization: "HB Enterprise",
    environment: "default",
    apiBaseUrl: "https://api.openai.com/v1",
    ipAddress: "192.168.1.55",
    endUser: "ravi.kumar@hb.com",
    requestType: "chat.completions",
    tags: ["Test Key", "Failure"],
    metrics: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cost: 0.000000,
      duration: 0.00,
      retries: 0,
      cacheStatus: "Miss",
      startTime: "2026-07-27T21:22:23.000Z",
      endTime: "2026-07-27T21:22:23.000Z",
      latencyMs: 0
    },
    costBreakdown: {
      inputCost: 0, outputCost: 0, originalLLMCost: 0, markup: 0, discount: 0, finalCost: 0, currency: "USD", totalCost: 0
    },
    requestPayload: { model: "gpt-4o-mini" },
    responsePayload: null,
    metadataPayload: { status: "failure", error_code: "429" },
    error: {
      code: "429",
      message: "Rate Limit Exceeded: Key TPM threshold breached.",
      type: "RateLimitError",
      traceback: "RateLimitError: 429 Rate limit reached for model gpt-4o-mini on TPM",
      httpStatus: 429
    },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "21:22:23.000", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Rate Limit Check", timestamp: "21:22:23.000", offsetSeconds: 0.00, status: "failed", detail: "429 Exceeded" }
    ]
  },
  {
    id: "758w7b5e-3da0-4211-9988-758w7b5e3da0",
    sessionId: "51454a5b-d301-4991-5145-51454a5bd301",
    timestamp: "2026-07-28T20:30:59.000Z",
    type: "LLM",
    callType: "chat.completions",
    status: "Failure",
    cost: 0.000000,
    duration: 0.00,
    teamName: "-",
    teamId: "-",
    keyHash: "hashed-jwt-ds...",
    keyAlias: "-",
    model: "gpt-4o",
    modelId: "gpt-4o-2026-05-13",
    provider: "OpenAI",
    organization: "HB Enterprise",
    environment: "development",
    apiBaseUrl: "https://api.openai.com/v1",
    ipAddress: "10.0.12.88",
    endUser: "dev.team@hb.com",
    requestType: "chat.completions",
    tags: ["Dev Environment"],
    metrics: {
      promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, duration: 0, retries: 0, cacheStatus: "Miss", startTime: "2026-07-28T20:30:59.000Z", endTime: "2026-07-28T20:30:59.000Z", latencyMs: 0
    },
    costBreakdown: { inputCost: 0, outputCost: 0, originalLLMCost: 0, markup: 0, discount: 0, finalCost: 0, currency: "USD", totalCost: 0 },
    requestPayload: { model: "gpt-4o" },
    responsePayload: null,
    metadataPayload: { status: "failure", error_code: "500" },
    error: {
      code: "500",
      message: "Internal Server Error: Provider Gateway Timeout",
      type: "InternalServerError",
      traceback: "InternalServerError: Provider did not respond within 30000ms",
      httpStatus: 500
    },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "20:30:59.000", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Provider Call", timestamp: "20:30:59.000", offsetSeconds: 0.00, status: "failed", detail: "500 Timeout" }
    ]
  },
  {
    id: "45ddh0ef-4491-4822-45dd-45ddh0ef4491",
    sessionId: "gadpap_r10-T102-45ddh0ef",
    timestamp: "2026-07-29T12:40:58.000Z",
    type: "LLM",
    callType: "acompletion",
    status: "Success",
    cost: 0.000036,
    duration: 1.64,
    teamName: "litellm-internal-he...",
    teamId: "team-litellm-01",
    keyHash: "lite11m-inter...",
    keyAlias: "litellm-internal-he...",
    model: "gemini-2.5-flash",
    modelId: "gemini-2.5-flash",
    provider: "Google",
    organization: "HB Enterprise",
    environment: "default",
    apiBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    ipAddress: "127.0.0.1",
    endUser: "john.doe@company.com",
    requestType: "acompletion",
    tags: ["Gemini AI", "Multimodal"],
    metrics: {
      promptTokens: 80, completionTokens: 120, totalTokens: 200, cost: 0.000036, duration: 1.64, retries: 0, cacheStatus: "Hit", startTime: "2026-07-29T12:40:58.000Z", endTime: "2026-07-29T12:40:59.640Z", latencyMs: 1640
    },
    costBreakdown: { inputCost: 0.000008, outputCost: 0.000028, originalLLMCost: 0.000036, markup: 0, discount: 0, finalCost: 0.000036, currency: "USD", totalCost: 0.000036 },
    requestPayload: { model: "gemini-2.5-flash", prompt: "Extract metadata from text." },
    responsePayload: { text: "Metadata extracted successfully." },
    metadataPayload: { status: "success" },
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "12:40:58.000", offsetSeconds: 0.00, status: "completed" },
      { id: "t2", step: "Completed", timestamp: "12:40:59.640", offsetSeconds: 1.64, status: "completed" }
    ]
  }
];

// Additional mock records to reach thousands of logs simulation
for (let i = 1; i <= 45; i++) {
  const isSuccess = i % 3 !== 0;
  const models = ["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "gemini-2.5-flash", "llama-3-70b"];
  const providers = ["OpenAI", "Anthropic", "Google", "Meta"];
  const model = models[i % models.length];
  const provider = providers[i % providers.length];

  mockRequestLogs.push({
    id: `req-${1000 + i}-${Math.random().toString(36).substring(2, 7)}`,
    sessionId: `sess-${2000 + i}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date(Date.now() - i * 3600000 * 2).toISOString(),
    type: i % 5 === 0 ? "Embedding" : i % 7 === 0 ? "Image" : "LLM",
    callType: "chat.completions",
    status: isSuccess ? "Success" : "Failure",
    cost: isSuccess ? parseFloat((0.000010 + i * 0.000002).toFixed(6)) : 0,
    duration: isSuccess ? parseFloat((0.85 + (i % 5) * 0.4).toFixed(2)) : 0,
    ttft: isSuccess ? parseFloat((0.80 + (i % 5) * 0.38).toFixed(2)) : undefined,
    teamName: i % 2 === 0 ? "Engineering" : i % 3 === 0 ? "Sales Team" : "DevOps",
    teamId: `team-${i % 3}`,
    keyHash: `hash-${i}992a01...`,
    keyAlias: i % 2 === 0 ? `Prod-Key-${i}` : `Dev-Key-${i}`,
    model: model,
    modelId: `${model}-latest`,
    provider: provider,
    organization: "HB Enterprise",
    environment: i % 4 === 0 ? "production" : "default",
    apiBaseUrl: `https://api.${provider.toLowerCase()}.com/v1`,
    ipAddress: `192.168.1.${10 + (i % 50)}`,
    endUser: `user-${i}@hb.com`,
    requestType: "chat.completions",
    tags: [`Env: ${i % 4 === 0 ? "production" : "default"}`, `User: user-${i}`],
    metrics: {
      promptTokens: 25 + i * 2,
      completionTokens: 50 + i * 5,
      totalTokens: 75 + i * 7,
      cost: isSuccess ? parseFloat((0.000010 + i * 0.000002).toFixed(6)) : 0,
      duration: isSuccess ? parseFloat((0.85 + (i % 5) * 0.4).toFixed(2)) : 0,
      retries: 0,
      cacheStatus: i % 4 === 0 ? "Hit" : "Miss",
      startTime: new Date(Date.now() - i * 3600000 * 2).toISOString(),
      endTime: new Date(Date.now() - i * 3600000 * 2 + 1500).toISOString(),
      latencyMs: 1500
    },
    costBreakdown: {
      inputCost: 0.000005,
      outputCost: 0.000015,
      originalLLMCost: 0.000020,
      markup: 0,
      discount: 0,
      finalCost: 0.000020,
      currency: "USD",
      totalCost: 0.000020
    },
    requestPayload: { model: model, messages: [{ role: "user", content: `Sample prompt #${i}` }] },
    responsePayload: isSuccess ? { choices: [{ message: { role: "assistant", content: `Sample output response #${i}` } }] } : null,
    metadataPayload: { status: isSuccess ? "success" : "failure", request_index: i },
    error: !isSuccess ? {
      code: "400",
      message: "Bad Request: Invalid model parameters passed in request body.",
      type: "InvalidRequestError",
      traceback: "InvalidRequestError: 400 Bad Request",
      httpStatus: 400
    } : undefined,
    timeline: [
      { id: "t1", step: "Request Started", timestamp: "00:00.000", offsetSeconds: 0, status: "completed" },
      { id: "t2", step: "Gateway Validation", timestamp: "00:00.012", offsetSeconds: 0.012, status: "completed" },
      { id: "t3", step: isSuccess ? "Completed" : "Failed", timestamp: "00:01.500", offsetSeconds: 1.500, status: isSuccess ? "completed" : "failed" }
    ]
  });
}

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: "AUD-901",
    user: "John Doe (Super Admin)",
    action: "Updated Model Settings",
    resource: "GPT-4o Gateway Config",
    timestamp: "Jul 31, 2026 14:10:00",
    details: "Changed TPM limit from 500k to 1,000k",
    ipAddress: "192.168.1.101"
  },
  {
    id: "AUD-902",
    user: "Sarah Connor (Org Admin)",
    action: "Revoked Virtual Key",
    resource: "CRM KEY (Key Hash: 098b9ac14...)",
    timestamp: "Jul 30, 2026 18:45:12",
    details: "Virtual key expired and manually revoked",
    ipAddress: "10.0.4.12"
  }
];

export const mockDeletedKeys: DeletedKeyItem[] = [
  {
    id: "DEL-KEY-01",
    keyAlias: "Staging-Test-Key",
    keyHash: "88c21a94bc12...",
    deletedBy: "alex.dev@hb.com",
    deletedAt: "Jul 29, 2026 11:20:00",
    team: "Engineering",
    reason: "Key security rotation policy"
  },
  {
    id: "DEL-KEY-02",
    keyAlias: "Legacy-CRM-Integration",
    keyHash: "0e1b1c4b335b...",
    deletedBy: "john.doe@company.com",
    deletedAt: "Jul 27, 2026 09:15:30",
    team: "Sales Team",
    reason: "Decommissioned endpoint"
  }
];

export const mockDeletedTeams: DeletedTeamItem[] = [
  {
    id: "DEL-TEAM-01",
    teamName: "Q3-Marketing-Lab",
    teamId: "team-mk-99",
    deletedBy: "john.doe@company.com",
    deletedAt: "Jul 25, 2026 16:30:00",
    membersCount: 4,
    reason: "Project completed"
  }
];
