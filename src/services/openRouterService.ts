import { analyzeLine } from '../utils/pingalEngine';
import { MeterSettings, LineAnalysis } from '../types/meter';

export interface SuggestedWord {
  word: string;
  pattern: string; // e.g. "લગા", "ગાગા"
  meaning: string;
}

export interface CorrectedLineOption {
  line: string;
  style: string;
  notes: string;
  verifiedPerfect: boolean;
  actualTokens: string;
  actualMatras: number;
}

export interface ChhandAiCorrectionResponse {
  suggestions: CorrectedLineOption[];
  explanation: string;
  suggestedWords: SuggestedWord[];
  modelUsed: string;
}

export const AVAILABLE_MODELS = [
  { id: 'nvidia/nemotron-3.5-lightning:free', name: 'Nemotron 3.5 Lightning (મફત / Free)', isFree: true },
  { id: 'google/gemma-4-31b-it:free', name: 'Google Gemma 4 31B (મફત / Free)', isFree: true },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (મફત / Free)', isFree: true },
  { id: 'google/gemini-2.5-flash', name: 'Google Gemini 2.5 Flash', isFree: false },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', isFree: false },
];

export const DEFAULT_MODEL = 'nvidia/nemotron-3.5-lightning:free';

/**
 * Retrieve OpenRouter API Key from LocalStorage, Vite env, or process.env
 */
export function getOpenRouterApiKey(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('openrouter_api_key');
    if (local && local.trim()) return local.trim();
  }

  const viteKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (viteKey && viteKey.trim()) return viteKey.trim();

  // @ts-ignore
  const procKey = typeof process !== 'undefined' ? (process.env.OPEN_ROUTER || process.env.OPENROUTER_API_KEY) : '';
  if (procKey && procKey.trim()) return procKey.trim();

  return '';
}

/**
 * Save custom API key in localStorage
 */
export function setOpenRouterApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('openrouter_api_key', key.trim());
  }
}

/**
 * Retrieve preferred model
 */
export function getPreferredModel(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('openrouter_preferred_model');
    if (saved) return saved;
  }
  return DEFAULT_MODEL;
}

/**
 * Save preferred model
 */
export function setPreferredModel(model: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('openrouter_preferred_model', model);
  }
}

/**
 * Request AI correction for a broken Ghazal line (છંદભંગ)
 */
export async function getChhandCorrectionSuggestions({
  brokenLine,
  targetPattern,
  targetTitle,
  lineAnalysis,
  fullGhazalContext,
  settings,
  model,
  customApiKey,
}: {
  brokenLine: string;
  targetPattern: string;
  targetTitle: string;
  lineAnalysis: LineAnalysis;
  fullGhazalContext: string;
  settings: MeterSettings;
  model?: string;
  customApiKey?: string;
}): Promise<ChhandAiCorrectionResponse> {
  const apiKey = (customApiKey || getOpenRouterApiKey()).trim();

  if (!apiKey) {
    throw new Error('ઓપનરાઉટર (OpenRouter) API કી મળી નથી. કૃપા કરીને .env માં સેટ કરો અથવા સેટિંગ્સમાં દાખલ કરો.');
  }

  const selectedModel = model || getPreferredModel();

  const userTokensStr = lineAnalysis.userTokens.join('');
  const targetTokensStr = lineAnalysis.targetTokens.join('');

  const systemPrompt = `તમે ગુજરાતી ભાષાના પીઢ પિંગળશાસ્ત્રી (Ghazal Prosody Expert) અને કવિ છો.
જ્યારે કોઈ ગઝલની પંક્તિમાં છંદભંગ (Meter Violation) થાય, ત્યારે તમારું કાર્ય:
1. મૂળ પંક્તિનો અર્થ, ભાવ, લાગણી અને કાવ્યાત્મકતા બિલકુલ ન બદલાય તે રીતે લક્ષ્ય છંદ (Target Bahar) માં બરાબર બેસતા ૨ થી ૩ સુધારેલા વિકલ્પો આપવા.
2. કવિ પોતાની ગઝલને વધુ સુંદર બનાવવા માટે વાપરી શકે તેવા ૩ થી ૫ વૈકલ્પિક ગુજરાતી સમાનાર્થી શબ્દો આપવા (જે લક્ષ્ય છંદના લઘુ/ગુરુ વજનમાં બંધબેસતા હોય).
3. મૂળ પંક્તિમાં શું ભૂલ હતી અને તે કેવી રીતે સુધરી તેની ટૂંકી સરળ ગુજરાતીમાં સમજૂતી આપવી.

અતિ મહત્વનો નિયમ:
- મૂળ ભાવ કે વિચાર બદલાવો ન જોઈએ.
- જવાબ ફક્ત નીચેના માન્ય JSON સ્વરૂપમાં જ આપો:
{
  "suggestions": [
    {
      "line": "સુધારેલી સંપૂર્ણ પંક્તિ",
      "style": "સરળ / શાસ્ત્રીય / પ્રાસયુક્ત",
      "notes": "શું સુધારો કર્યો તેની ટૂંકી નોંધ"
    }
  ],
  "suggestedWords": [
    {
      "word": "શબ્દ",
      "pattern": "લગા / ગાગા / લગાગા",
      "meaning": "અર્થ અથવા સંદર્ભ"
    }
  ],
  "explanation": "પિંગળશાસ્ત્ર અનુસાર થયેલા સુધારાની ટૂંકી ગુજરાતી સમજૂતી"
}`;

  const userPrompt = `મૂળ પંક્તિ (છંદભંગવાળી): "${brokenLine}"
લક્ષ્ય છંદનું નામ: "${targetTitle}"
લક્ષ્ય છંદનું વજન (Target Pattern): "${targetPattern}" (અક્ષરો: ${lineAnalysis.targetTokens.length}, લક્ષ્ય માત્રા: ${lineAnalysis.targetMatras})
હાલનું કાઢેલું વજન: "${userTokensStr}" (હાલની માત્રા: ${lineAnalysis.userMatras})
તપાસકની વિસંગતતા નોંધ: "${lineAnalysis.summaryMessage}"

સંપૂર્ણ ગઝલનો સંદર્ભ (રદીફ/કાફિયા અને ભાવ સમજવા માટે):
"""
${fullGhazalContext}
"""

કૃપા કરીને મૂળ પંક્તિનો અર્થ અને કાવ્યભાવ જાળવી રાખીને લક્ષ્ય છંદ "${targetPattern}" માં 100% બંધબેસતા સુધારાઓ JSON સ્વરૂપમાં આપો.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'Gujarati Ghazal Meter Checker',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      let parsedErr: any = null;
      try {
        parsedErr = JSON.parse(errText);
      } catch {}

      if (res.status === 402) {
        throw new Error('OpenRouter એકાઉન્ટમાં ક્રેડિટ સમાપ્ત થઈ ગઈ છે. કૃપા કરીને સેટિંગ્સમાંથી મફત (Free) મોડલ પસંદ કરો જેમ કે Nemotron અથવા Gemma.');
      } else if (res.status === 429) {
        throw new Error('મોડલ રેટ-લિમિટ થઈ ગયું છે. કૃપા કરીને થોડી ક્ષણો પછી ફરી પ્રયત્ન કરો અથવા અન્ય મોડલ પસંદ કરો.');
      }

      const msg = parsedErr?.error?.message || `API એરર (${res.status}): ${errText}`;
      throw new Error(msg);
    }

    const data = await res.json();
    const rawContent: string = data.choices?.[0]?.message?.content || '';

    // Extract JSON from potential markdown wrappers
    let cleanJsonStr = rawContent.trim();
    if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    // Fallback regex extraction if any extra prose exists
    const jsonMatch = cleanJsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJsonStr = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanJsonStr);

    const rawSuggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    const suggestedWords: SuggestedWord[] = Array.isArray(parsed.suggestedWords) ? parsed.suggestedWords : [];
    const explanation: string = parsed.explanation || 'પિંગળશાસ્ત્રના નિયમો મુજબ પંક્તિનું માત્રા માળખું લક્ષ્ય છંદ સાથે મેળવીને સુધારેલ છે.';

    // Run dual-verification using local pingalEngine
    const verifiedSuggestions: CorrectedLineOption[] = rawSuggestions.map((item: any) => {
      const lineStr = (item.line || '').trim();
      const analysis = analyzeLine(lineStr, targetPattern, settings, 0);

      return {
        line: lineStr,
        style: item.style || 'સુધારેલ',
        notes: item.notes || '',
        verifiedPerfect: analysis.isPerfect,
        actualTokens: analysis.userTokens.join(''),
        actualMatras: analysis.userMatras,
      };
    });

    return {
      suggestions: verifiedSuggestions,
      explanation,
      suggestedWords,
      modelUsed: selectedModel,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('વિનંતી સમયસીમા સમાપ્ત થઈ (Timeout). કૃપા કરીને ફરી પ્રયત્ન કરો.');
    }
    throw err;
  }
}