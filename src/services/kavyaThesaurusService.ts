import { getOpenRouterApiKey, getPreferredModel } from './openRouterService';

export interface ThesaurusWord {
  word: string;
  pattern: string; // e.g. "ગા", "લગા", "ગાગા", "લગાગા"
  matras: number;
  category: string;
  meaning: string;
  exampleUsage?: string;
}

export const CURATED_KAVYA_DICTIONARY: ThesaurusWord[] = [
  // પ્રેમ અને સ્નેહ (Love & Romance)
  { word: "પ્રેમ", pattern: "ગા", matras: 2, category: "પ્રેમ", meaning: "સ્નેહ, પ્રીતિ, હેત" },
  { word: "સ્નેહ", pattern: "ગા", matras: 2, category: "પ્રેમ", meaning: "વહાલ, અનુરાગ" },
  { word: "પ્રીત", pattern: "ગા", matras: 2, category: "પ્રેમ", meaning: "પ્રેમ, આકર્ષણ" },
  { word: "ઇશ્ક", pattern: "ગા", matras: 2, category: "પ્રેમ", meaning: "તીવ્ર પ્રેમ, દિલગીરી" },
  { word: "ચાહત", pattern: "ગાગા", matras: 4, category: "પ્રેમ", meaning: "ઝંખના, અભિલાષા" },
  { word: "મોહબ્બત", pattern: "લગાગા", matras: 5, category: "પ્રેમ", meaning: "પરમ સ્નેહ, નિષ્ઠા" },
  { word: "અનુરાગ", pattern: "લલગાગા", matras: 6, category: "પ્રેમ", meaning: "ઊંડી લાગણી, પ્રેમભાવ" },
  { word: "મિલન", pattern: "લલલ", matras: 3, category: "પ્રેમ", meaning: "મુલાકાત, ભેટવું" },
  { word: "સંગાથ", pattern: "લગાગા", matras: 5, category: "પ્રેમ", meaning: "સાથ, સહવાસ" },
  { word: "યાદ", pattern: "ગા", matras: 2, category: "પ્રેમ", meaning: "સ્મૃતિ, સુરતા" },
  { word: "યાદી", pattern: "ગાગા", matras: 4, category: "પ્રેમ", meaning: "સ્મરણ, યાદ" },
  { word: "સ્મિત", pattern: "ગા", matras: 2, category: "પ્રેમ", meaning: "મલકાટ, હાસ્ય" },
  { word: "હસીન", pattern: "લગા", matras: 3, category: "પ્રેમ", meaning: "સુંદર, મનોહર" },
  { word: "રૂપ", pattern: "ગા", matras: 2, category: "પ્રેમ", meaning: "સૌંદર્ય, લાક્ષણિકતા" },

  // દર્દ અને વિરહ (Pain & Longing)
  { word: "દર્દ", pattern: "ગા", matras: 2, category: "દર્દ", meaning: "પીડા, વેદના, વ્યથા" },
  { word: "પીડા", pattern: "ગાગા", matras: 4, category: "દર્દ", meaning: "દુઃખ, કષ્ટ" },
  { word: "વેદના", pattern: "ગાગાગા", matras: 6, category: "દર્દ", meaning: "મનની ભીતરની પીડા" },
  { word: "વિરહ", pattern: "લલલ", matras: 3, category: "દર્દ", meaning: "જુદાઈ, વિયોગ" },
  { word: "જુદાઈ", pattern: "લગાગા", matras: 5, category: "દર્દ", meaning: "વિરહ, અલગ થવું" },
  { word: "આંસુ", pattern: "ગાગા", matras: 4, category: "દર્દ", meaning: "અશ્રુ, નેણજળ" },
  { word: "અશ્રુ", pattern: "ગાગા", matras: 4, category: "દર્દ", meaning: "આંખનું પાણી" },
  { word: "આહ", pattern: "ગા", matras: 2, category: "દર્દ", meaning: "નિસાસો, દર્દભરી બૂમ" },
  { word: "ઘાવ", pattern: "ગા", matras: 2, category: "દર્દ", meaning: "જખમ, ઈજા" },
  { word: "જખમ", pattern: "લલલ", matras: 3, category: "દર્દ", meaning: "રૂઝ ન આવતો ઘા" },
  { word: "રૂદન", pattern: "લલલ", matras: 3, category: "દર્દ", meaning: "રડવું, શોક" },
  { word: "માતમ", pattern: "ગાગા", matras: 4, category: "દર્દ", meaning: "શોક, વિલાપ" },

  // હૃદય અને નજર (Heart, Soul & Gaze)
  { word: "દિલ", pattern: "લલ", matras: 2, category: "હૃદય", meaning: "હૃદય, મન, અંતર" },
  { word: "હૃદય", pattern: "લલલ", matras: 3, category: "હૃદય", meaning: "અંતઃકરણ, છાતી" },
  { word: "મન", pattern: "લલ", matras: 2, category: "હૃદય", meaning: "ચિત્ત, અંતર" },
  { word: "અંતર", pattern: "ગાલલ", matras: 4, category: "હૃદય", meaning: "અંતરાત્મા, ભીતર" },
  { word: "જિગર", pattern: "લલલ", matras: 3, category: "હૃદય", meaning: "કલેજું, હિંમત" },
  { word: "નયન", pattern: "લલલ", matras: 3, category: "હૃદય", meaning: "આંખ, લોચન" },
  { word: "આંખ", pattern: "ગા", matras: 2, category: "હૃદય", meaning: "નેત્ર, ચક્ષુ" },
  { word: "નજર", pattern: "લલલ", matras: 3, category: "હૃદય", meaning: "દ્રષ્ટિ, નિગાહ" },
  { word: "દ્રષ્ટિ", pattern: "ગાગા", matras: 4, category: "હૃદય", meaning: "જોવું, નજર" },
  { word: "નિગાહ", pattern: "લગા", matras: 3, category: "હૃદય", meaning: "નજર, કટાક્ષ" },

  // રાત અને પ્રકૃતિ (Night, Nature & Atmosphere)
  { word: "રાત", pattern: "ગા", matras: 2, category: "પ્રકૃતિ", meaning: "નિશા, રજની, શબ" },
  { word: "શબ", pattern: "લલ", matras: 2, category: "પ્રકૃતિ", meaning: "રાત્રિ, અંધકાર" },
  { word: "સાંજ", pattern: "ગા", matras: 2, category: "પ્રકૃતિ", meaning: "સંધ્યા, શામ" },
  { word: "સંધ્યા", pattern: "ગાગા", matras: 4, category: "પ્રકૃતિ", meaning: "સાંજની વેળા" },
  { word: "સવાર", pattern: "લગા", matras: 3, category: "પ્રકૃતિ", meaning: "પ્રભાત, સુબહ" },
  { word: "પ્રભાત", pattern: "લગાગા", matras: 5, category: "પ્રકૃતિ", meaning: "સૂર્યોદય, સવાર" },
  { word: "ચાંદ", pattern: "ગા", matras: 2, category: "પ્રકૃતિ", meaning: "ચંદ્ર, શશિ, મહેતાબ" },
  { word: "ચંદ્ર", pattern: "ગાગા", matras: 4, category: "પ્રકૃતિ", meaning: "સુધાકર, ચાંદ" },
  { word: "તારા", pattern: "ગાગા", matras: 4, category: "પ્રકૃતિ", meaning: "નક્ષત્ર, સિતારા" },
  { word: "સિતારા", pattern: "લગાગા", matras: 5, category: "પ્રકૃતિ", meaning: "આકાશના તારલા" },
  { word: "પવન", pattern: "લલલ", matras: 3, category: "પ્રકૃતિ", meaning: "સમીર, વાયરો, હવા" },
  { word: "સમીર", pattern: "લગા", matras: 3, category: "પ્રકૃતિ", meaning: "મંદ સુગંધી પવન" },
  { word: "ગુલ", pattern: "લલ", matras: 2, category: "પ્રકૃતિ", meaning: "ફૂલ, પુષ્પ" },
  { word: "બાગ", pattern: "ગા", matras: 2, category: "પ્રકૃતિ", meaning: "ઉપવન, બગીચો" },
  { word: "ચમન", pattern: "લલલ", matras: 3, category: "પ્રકૃતિ", meaning: "ફૂલવાડી, બાગ" },

  // સૂફી, ખુમારી અને દર્શન (Sufi, Philosophy & Pride)
  { word: "ખુદા", pattern: "લગા", matras: 3, category: "સૂફી", meaning: "ઈશ્વર, પરમાત્મા, રબ" },
  { word: "ઈશ્વર", pattern: "ગાગાલ", matras: 5, category: "સૂફી", meaning: "ભગવાન, પ્રભુ" },
  { word: "જીવન", pattern: "ગાલલ", matras: 4, category: "સૂફી", meaning: "જિંદગી, આયુષ્ય" },
  { word: "જિંદગી", pattern: "ગાગાગા", matras: 6, category: "સૂફી", meaning: "જીવન, હયાતી" },
  { word: "મોત", pattern: "ગા", matras: 2, category: "સૂફી", meaning: "મૃત્યુ, મરણ, ફના" },
  { word: "મૃત્યુ", pattern: "ગાગા", matras: 4, category: "સૂફી", meaning: "અંતિમ સત્ય, મોત" },
  { word: "ફના", pattern: "લગા", matras: 3, category: "સૂફી", meaning: "વિલીન થવું, નષ્ટ થવું" },
  { word: "બંદગી", pattern: "ગાગાગા", matras: 6, category: "સૂફી", meaning: "પ્રાર્થના, પૂજા, ઈબાદત" },
  { word: "ઈબાદત", pattern: "લગાગા", matras: 5, category: "સૂફી", meaning: "ભક્તિ, પ્રાર્થના" },
  { word: "ખુમારી", pattern: "લગાગા", matras: 5, category: "સૂફી", meaning: "સ્વાભિમાન, મસ્તી" },
  { word: "મસ્તી", pattern: "ગાગા", matras: 4, category: "સૂફી", meaning: "આનંદ, તરંગ, સુરુર" },
  { word: "સુરુર", pattern: "લગા", matras: 3, category: "સૂફી", meaning: "નશો, કેફ, મનોદશા" },
  { word: "પંથ", pattern: "ગા", matras: 2, category: "સૂફી", meaning: "માર્ગ, રસ્તો, કેડી" },
  { word: "મુસાફિર", pattern: "લગાગાલ", matras: 6, category: "સૂફી", meaning: "યાત્રી, પંથી" },
];

/**
 * Filter words from curated dictionary
 */
export function searchKavyaThesaurus({
  query = '',
  pattern = '',
  category = '',
}: {
  query?: string;
  pattern?: string;
  category?: string;
}): ThesaurusWord[] {
  let list = CURATED_KAVYA_DICTIONARY;

  if (category && category !== 'બધા') {
    list = list.filter((w) => w.category === category);
  }

  if (pattern && pattern !== 'બધા') {
    list = list.filter((w) => w.pattern === pattern);
  }

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (w) =>
        w.word.includes(q) ||
        w.meaning.includes(q) ||
        w.category.includes(q) ||
        w.pattern.includes(q)
    );
  }

  return list;
}

/**
 * AI-powered expansion for any custom word or meter requirement
 */
export async function getAiThesaurusSuggestions(keyword: string, targetPattern?: string): Promise<ThesaurusWord[]> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error('OpenRouter API Key સેટ નથી.');
  }

  const model = getPreferredModel();
  const systemPrompt = `તમે ગુજરાતી ભાષાના ગઝલ શબ્દકોશ નિષ્ણાત છો.
આપેલા શબ્દ માટે ગઝલ શાયરીમાં વપરાતા સુંદર સમાનાર્થી શબ્દો, તેમનું લઘુ-ગુરુ વજન (pattern જેમ કે 'ગા', 'લગા', 'ગાગા', 'લગાગા'), માત્રા અને અર્થ નીચેના JSON માં આપો:
{
  "words": [
    {
      "word": "શબ્દ",
      "pattern": "લગા",
      "matras": 3,
      "category": "પ્રેમ / દર્દ / સામાન્ય",
      "meaning": "ટૂંકો અર્થ"
    }
  ]
}`;

  const userPrompt = `શબ્દ: "${keyword}"${targetPattern ? `\nજરૂરી વજન/છંદ: "${targetPattern}"` : ''}
કૃપા કરીને આ શબ્દના ૬ થી ૧૦ ઉમદા ગુજરાતી ગઝલ સમાનાર્થી શબ્દો આપો.`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    throw new Error('AI શબ્દકોશ વિનંતી નિષ્ફળ રહી.');
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  const cleanJson = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(cleanJson);

  return Array.isArray(parsed.words) ? parsed.words : [];
}