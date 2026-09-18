/**
 * LLM Client Layer
 *
 * Provides a lightweight, official fetch-based client for OpenAI-compatible
 * chat completions (compatible with OpenAI, Groq, Ollama, OpenRouter, Azure, and Gemini).
 */

export class LLMClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.LLM_API_KEY || "";
    this.model = options.model || process.env.LLM_MODEL || "gpt-4o-mini";
    this.baseURL = options.baseURL || process.env.LLM_BASE_URL || "https://api.openai.com/v1";
    this.timeoutMs = options.timeoutMs || 30000;
  }

  /**
   * Completes a chat prompt and returns the raw string response.
   * @param {Object} params
   * @param {string} params.prompt - The user/evaluation prompt
   * @param {string} [params.systemPrompt] - System instructions
   * @param {number} [params.temperature] - Sampling temperature (default: 0.2)
   * @returns {Promise<string>}
   */
  async complete({ prompt, systemPrompt = "You are an expert Low-Level Design (LLD) interviewer and software architect.", temperature = 0.2 }) {
    if (!this.apiKey) {
      throw new Error("LLM_API_KEY is not configured in the backend environment.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const endpoint = `${this.baseURL.replace(/\/+$/, "")}/chat/completions`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        let errorMessage = `LLM provider error (status ${response.status} ${response.statusText})`;
        try {
          const parsed = JSON.parse(errorBody);
          if (parsed.error?.message) {
            errorMessage = `LLM provider error (${response.status}): ${parsed.error.message}`;
          }
        } catch {
          // keep fallback
        }
        throw new Error(errorMessage);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("LLM provider returned empty completion content.");
      }

      return content;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error(`LLM provider request timed out after ${this.timeoutMs}ms.`);
      }
      throw err;
    }
  }
}

/**
 * Mock LLM client for offline automated testing.
 */
export class MockLLMClient {
  constructor(cannedResponseOrFn) {
    this.cannedResponseOrFn = cannedResponseOrFn;
    this.model = "mock-model";
    this.callCount = 0;
    this.lastPrompt = null;
  }

  async complete({ prompt, systemPrompt }) {
    this.callCount++;
    this.lastPrompt = prompt;

    if (typeof this.cannedResponseOrFn === "function") {
      return this.cannedResponseOrFn({ prompt, systemPrompt });
    }

    if (this.cannedResponseOrFn instanceof Error) {
      throw this.cannedResponseOrFn;
    }

    return typeof this.cannedResponseOrFn === "string"
      ? this.cannedResponseOrFn
      : JSON.stringify(this.cannedResponseOrFn);
  }
}

export const defaultLLMClient = new LLMClient();
