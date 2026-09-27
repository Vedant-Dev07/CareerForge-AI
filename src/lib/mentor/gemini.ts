import "server-only";

import { GeminiConfigurationError } from "@/lib/gemini";
import { buildMentorPrompt, type MentorHistoryItem } from "@/lib/mentor/prompt";
import { MENTOR_ACTION_TYPES, type MentorAction, type MentorContext, type MentorResponse } from "@/lib/mentor/types";

export class GeminiMentorError extends Error { constructor(message: string) { super(message); this.name = "GeminiMentorError"; } }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }

function parseMentorResponse(value: unknown, candidates: MentorAction[]): MentorResponse {
  if (!isRecord(value) || typeof value.message !== "string" || !value.message.trim() || value.message.length > 6_000) throw new GeminiMentorError("Gemini returned an invalid mentor response.");
  const rawActions = Array.isArray(value.actions) ? value.actions : [];
  if (rawActions.length > 3) throw new GeminiMentorError("Gemini returned too many mentor actions.");
  const actions = rawActions.flatMap((action) => {
    if (!isRecord(action) || typeof action.type !== "string" || typeof action.id !== "string" || !MENTOR_ACTION_TYPES.includes(action.type as (typeof MENTOR_ACTION_TYPES)[number])) return [];
    const candidate = candidates.find((item) => item.type === action.type && item.id === action.id);
    return candidate ? [candidate] : [];
  });
  return { message: value.message.trim(), actions: [...new Map(actions.map((action) => [action.id, action])).values()] };
}

export async function getMentorResponse(context: MentorContext, history: MentorHistoryItem[], question: string): Promise<MentorResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiConfigurationError();
  let response: Response | null = null;
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: buildMentorPrompt(context, history, question) }] }], generationConfig: { temperature: 0.35, responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { message: { type: "STRING" }, actions: { type: "ARRAY", items: { type: "OBJECT", properties: { type: { type: "STRING" }, id: { type: "STRING" } }, required: ["type", "id"] } } }, required: ["message", "actions"] } } }),
    signal: AbortSignal.timeout(30_000),
  };
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", request);
      if (response.ok || response.status < 500 || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  } catch (error) { console.error("Gemini mentor request failed:", error); throw new GeminiMentorError("Gemini mentor request failed."); }
  if (!response?.ok) { console.error("Gemini mentor returned HTTP", response?.status); throw new GeminiMentorError("Gemini mentor request failed."); }
  let payload: unknown;
  try { payload = await response.json(); } catch { throw new GeminiMentorError("Gemini returned an unreadable mentor response."); }
  const text = isRecord(payload) && Array.isArray(payload.candidates) ? payload.candidates.flatMap((candidate) => isRecord(candidate) && isRecord(candidate.content) && Array.isArray(candidate.content.parts) ? candidate.content.parts : []).find((part): part is Record<string, unknown> => isRecord(part) && typeof part.text === "string")?.text : null;
  if (typeof text !== "string" || !text) throw new GeminiMentorError("Gemini returned no mentor response.");
  try { return parseMentorResponse(JSON.parse(text), context.actionCandidates); } catch (error) { if (error instanceof GeminiMentorError) throw error; throw new GeminiMentorError("Gemini returned malformed mentor JSON."); }
}
