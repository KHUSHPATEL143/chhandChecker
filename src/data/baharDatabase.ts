import { BaharDef } from '../types/meter';

// Helper to calculate total matras of a clean pattern
export function calculateMatrasFromPattern(pattern: string): { matras: number; count: number } {
  let matras = 0;
  let count = 0;
  let i = 0;
  while (i < pattern.length) {
    if (pattern[i] === 'ગ' && i + 1 < pattern.length && pattern[i + 1] === 'ા') {
      matras += 2;
      count += 1;
      i += 2;
    } else if (pattern[i] === 'લ') {
      matras += 1;
      count += 1;
      i += 1;
    } else {
      i += 1;
    }
  }
  return { matras, count };
}

export const BAHAR_DATABASE: BaharDef[] = [
  {
    id: 1,
    title: "છંદ ૧ (લગાગા લગાગા લગાગા લગાગા)",
    pattern: "લગાગા લગાગા લગાગા લગાગા",
    cleanPattern: "લગાગાલગાગાલગાગાલગાગા",
    classicalName: "બહરે હઝજ મુસમ્મન સાલિમ (મફાઈલુન ૪ વખત)",
    category: "હઝજ (Hazaj)",
    rukns: ["મફાઈલુન", "મફાઈલુન", "મફાઈલુન", "મફાઈલુન"],
    totalMatras: 20,
    syllableCount: 12,
    description: "ગુજરાતી ગઝલનો સૌથી લોકપ્રિય છંદ. ઉદાહરણ: 'નયનને બંધ રાખીને જોયા છે તમને' - બેફામ"
  },
  {
    id: 2,
    title: "છંદ ૨ (લગાગા લગાગા લગાગા લગા)",
    pattern: "લગાગા લગાગા લગાગા લગા",
    cleanPattern: "લગાગાલગાગાલગાગાલગા",
    classicalName: "બહરે હઝજ મુસમ્મન મહઝૂફ (મફાઈલુન ૩ વખત + ફઊલુન)",
    category: "હઝજ (Hazaj)",
    rukns: ["મફાઈલુન", "મફાઈલુન", "મફાઈલુન", "ફઊલુન"],
    totalMatras: 18,
    syllableCount: 11,
    description: "અંતે એક લઘુ ઓછો હોવાથી કાવ્યમાં વિશિષ્ટ લય આવે છે."
  },
  {
    id: 3,
    title: "છંદ ૩ (ગાલગાગા લગાગા લગાગા લગાગા લગા)",
    pattern: "ગાલગાગા લગાગા લગાગા લગાગા લગા",
    cleanPattern: "ગાલગાગાલગાગાલગાગાલગાગાલગા",
    classicalName: "બહરે હઝજ મુસમ્મન અખરબ (મફઊલુ મફાઈલુન...)",
    category: "હઝજ (Hazaj)",
    rukns: ["મફઊલુ", "મફાઈલુન", "મફાઈલુન", "મફાઈલુન", "ફઅલ"],
    totalMatras: 23,
    syllableCount: 14,
    description: "પ્રારંભમાં ગુરુ આવતો હોવાથી પ્રભાવશાળી વજન બને છે."
  },
  {
    id: 4,
    title: "છંદ ૪ (ગાલગાગા લગાગા લગાગા)",
    pattern: "ગાલગાગા લગાગા લગાગા",
    cleanPattern: "ગાલગાગાલગાગાલગાગા",
    classicalName: "બહરે હઝજ મુસદ્દસ અખરબ (મફઊલુ મફાઈલુન મફાઈલુન)",
    category: "હઝજ (Hazaj)",
    rukns: ["મફઊલુ", "મફાઈલુન", "મફાઈલુન"],
    totalMatras: 17,
    syllableCount: 10,
    description: "મધ્યમ કદની બહર. અમૃત ઘાયલની અનેક રચનાઓમાં વપરાયેલ છે."
  },
  {
    id: 5,
    title: "છંદ ૫ (ગાલગાગા લગાગા લગા)",
    pattern: "ગાલગાગા લગાગા લગા",
    cleanPattern: "ગાલગાગાલગાગાલગા",
    classicalName: "બહરે હઝજ મુસદ્દસ મહઝૂફ",
    category: "હઝજ (Hazaj)",
    rukns: ["મફઊલુ", "મફાઈલુન", "ફઊલુન"],
    totalMatras: 15,
    syllableCount: 9,
    description: "ટૂંકી અને ચપળ લય ધરાવતી ગઝલ માટે ઉપયુક્ત છંદ."
  },
  {
    id: 6,
    title: "છંદ ૬ (ગાલગાગા લગાગા લગાગા)",
    pattern: "ગાલગાગા લગાગા લગાગા",
    cleanPattern: "ગાલગાગાલગાગાલગાગા",
    classicalName: "બહરે હઝજ મુસદ્દસ અશતર",
    category: "હઝજ (Hazaj)",
    rukns: ["મફઊલુ", "મફાઈલુન", "મફાઈલુન"],
    totalMatras: 17,
    syllableCount: 10,
    description: "ભાવપ્રધાન અને મનોરમ્ય કાવ્યપ્રવાહ માટે પ્રખ્યાત."
  },
  {
    id: 7,
    title: "છંદ ૭ (લગાલગા લગાલગા લગાલગા લગાલગા)",
    pattern: "લગાલગા લગાલગા લગાલગા લગાલગા",
    cleanPattern: "લગાલગાલગાલગાલગાલગાલગાલગા",
    classicalName: "બહરે મુતદારિક મુસમ્મન સાલિમ (ફઊલુન ૪ વખત - વૈકલ્પિક)",
    category: "મુતદારિક / રજઝ",
    rukns: ["ફઊલુન", "ફઊલુન", "ફઊલુન", "ફઊલુન"],
    totalMatras: 24,
    syllableCount: 16,
    description: "તરંગિત ઝૂલણા જેવો પ્રવાહ, વાંચતા જ મન ડોલી ઊઠે તેવો લય."
  },
  {
    id: 8,
    title: "છંદ ૮ (ગાલગા લગાલગા ગાલગા લગાલગા)",
    pattern: "ગાલગા લગાલગા ગાલગા લગાલગા",
    cleanPattern: "ગાલગાલગાલગાગાલગાલગાલગા",
    classicalName: "બહરે મુતદારિક મુસમ્મન મુખ્તલિફ",
    category: "મુતદારિક",
    rukns: ["ફાઈલુન", "ફઊલુન", "ફાઈલુન", "ફઊલુન"],
    totalMatras: 22,
    syllableCount: 14,
    description: "ગુરુ-લઘુના સમતોલ મિશ્રણવાળો સંગીતમય છંદ."
  },
  {
    id: 9,
    title: "છંદ ૯ (ગાગાલલ ગાગાલલ ગાગાલલ ગા)",
    pattern: "ગાગાલલ ગાગાલલ ગાગાલલ ગા",
    cleanPattern: "ગાગાલલગાગાલલગાગાલલગા",
    classicalName: "બહરે કામિલ મુસમ્મન મકતૂઅ",
    category: "કામિલ",
    rukns: ["મુતફાઈલુન", "મુતફાઈલુન", "મુતફાઈલુન", "ફઅલ"],
    totalMatras: 20,
    syllableCount: 13,
    description: "બે ગુરુ અને બે લઘુનું પુનરાવર્તન - અનોખી ગતિ આપે છે."
  },
  {
    id: 10,
    title: "છંદ ૧૦ (લગાગાગા લગાગાગા લગાગાગા લગાગાગા)",
    pattern: "લગાગાગા લગાગાગા લગાગાગા લગાગાગા",
    cleanPattern: "લગાગાગાલગાગાગાલગાગાગાલગાગાગા",
    classicalName: "બહરે રમલ મુસમ્મન સાલિમ (ફાઈલાતુન ૪ વખત)",
    category: "રમલ (Ramal)",
    rukns: ["ફાઈલાતુન", "ફાઈલાતુન", "ફાઈલાતુન", "ફાઈલાતુન"],
    totalMatras: 28,
    syllableCount: 16,
    description: "કલાપી અને કાન્ત જેવા કવિઓનો પ્રિય રમલ છંદ. 'જ્યાં જ્યાં નજર મારી ઠરે...'"
  },
  {
    id: 11,
    title: "છંદ ૧૧ (લગાગાગા લગાગાગા લગા)",
    pattern: "લગાગાગા લગાગાગા લગા",
    cleanPattern: "લગાગાગાલગાગાગાલગા",
    classicalName: "બહરે રમલ મુસદ્દસ મહઝૂફ",
    category: "રમલ (Ramal)",
    rukns: ["ફાઈલાતુન", "ફાઈલાતુન", "ફાઈલુન"],
    totalMatras: 17,
    syllableCount: 10,
    description: "ટૂંકી પંક્તિઓમાં ઊંડી વેદના વ્યક્ત કરવા ઉત્તમ માધ્યમ."
  },
  {
    id: 12,
    title: "છંદ ૧૨ (ગાલગાગાગા લગાગાગા લગાગાગા લગા)",
    pattern: "ગાલગાગાગા લગાગાગા લગાગાગા લગા",
    cleanPattern: "ગાલગાગાગાલગાગાગાલગાગાગાલગા",
    classicalName: "બહરે રમલ મુસમ્મન મશ્કૂલ",
    category: "રમલ (Ramal)",
    rukns: ["ફાઈલાતુન", "ફાઈલાતુન", "ફાઈલાતુન", "ફઅલ"],
    totalMatras: 26,
    syllableCount: 15,
    description: "ગંભીર ચિંતન અને દાર્શનિક ગઝલ માટે વપરાતો છંદ."
  },
  {
    id: 13,
    title: "છંદ ૧૩ (ગાલગાગાગા લગાગાગા લગા)",
    pattern: "ગાલગાગાગા લગાગાગા લગા",
    cleanPattern: "ગાલગાગાગાલગાગાગાલગા",
    classicalName: "બહરે રમલ મુસદ્દસ મશ્કૂલ",
    category: "રમલ (Ramal)",
    rukns: ["ફાઈલાતુન", "ફાઈલાતુન", "ફઅલ"],
    totalMatras: 19,
    syllableCount: 11,
    description: "ઝડપી વાચન અને સ્પષ્ટ ઉચ્ચારણ માટે અનુકૂળ."
  },
  {
    id: 14,
    title: "છંદ ૧૪ (ગાલગાગાગા લગા)",
    pattern: "ગાલગાગાગા લગા",
    cleanPattern: "ગાલગાગાગાલગા",
    classicalName: "બહરે રમલ મુરબ્બા મહઝૂફ",
    category: "રમલ (Ramal)",
    rukns: ["ફાઈલાતુન", "ફાઈલુન"],
    totalMatras: 12,
    syllableCount: 7,
    description: "અતિ સંક્ષિપ્ત બહર (મુખ્તસર બહર), હાઈકુ જેવો પ્રભાવ પાડે છે."
  },
  {
    id: 15,
    title: "છંદ ૧૫ (ગાગાલગાગાગા લગાગાગા લગાગાગા લગા)",
    pattern: "ગાગાલગાગાગા લગાગાગા લગાગાગા લગા",
    cleanPattern: "ગાગાલગાગાગાલગાગાગાલગાગાગાલગા",
    classicalName: "બહરે મુસ્તત્તીલ મુસમ્મન",
    category: "મુસ્તત્તીલ",
    rukns: ["મુસ્તફઇલાતુન", "ફાઈલાતુન", "ફાઈલાતુન", "ફઅલ"],
    totalMatras: 28,
    syllableCount: 16,
    description: "લાંબી અને વજનદાર પંક્તિઓ ધરાવતો છંદ."
  },
  {
    id: 16,
    title: "છંદ ૧૬ (લલગાલગા લલગાલગા)",
    pattern: "લલગાલગા લલગાલગા",
    cleanPattern: "લલગાલગાલલગાલગા",
    classicalName: "બહરે મુતકારિબ મુસદ્દસ મશ્કૂલ",
    category: "મુતકારિબ (Mutaqarib)",
    rukns: ["ફઊલુન", "ફઊલુન", "ફઊલુન", "ફઊલુન"],
    totalMatras: 16,
    syllableCount: 10,
    description: "ઝડપી નાચતો લય. બાળગીતો અને ઉત્સાહભરી ગઝલોમાં વધુ વપરાય."
  },
  {
    id: 17,
    title: "છંદ ૧૭ (લગાલગાગા લગાલગાગા)",
    pattern: "લગાલગાગા લગાલગાગા",
    cleanPattern: "લગાલગાગાલગાલગાગા",
    classicalName: "બહરે મુઝારિ મુસદ્દસ અખરબ",
    category: "મુઝારિ (Muzari)",
    rukns: ["મફઊલુ", "ફાઈલાતુન", "મફઊલુ", "ફાઈલાતુન"],
    totalMatras: 18,
    syllableCount: 10,
    description: "રમેશ પારેખ અને આદિલ મન્સૂરીની રચનાઓમાં પ્રિય છંદ."
  },
  {
    id: 18,
    title: "છંદ ૧૮ (૧૬ વખત ગા)",
    pattern: "ગાગાગાગાગાગાગાગાગાગાગાગાગાગાગાગા",
    cleanPattern: "ગાગાગાગાગાગાગાગાગાગાગાગાગાગાગાગા",
    classicalName: "બહરે કામિલ મુસમ્મન મુઝાલફ (૧૬ ગુરુ)",
    category: "સર્વગુરુ (All Guru)",
    rukns: ["ગા ગા ગા ગા", "ગા ગા ગા ગા", "ગા ગા ગા ગા", "ગા ગા ગા ગા"],
    totalMatras: 32,
    syllableCount: 16,
    description: "૧૬ વખત માત્ર ગુરુ અક્ષરો. ગંભીર અને ભારદાર રજૂઆત માટે ઉત્તમ."
  },
  {
    id: 19,
    title: "છંદ ૧૯ (૧૫ વખત ગા)",
    pattern: "ગાગાગાગાગાગાગાગાગાગાગાગાગાગાગા",
    cleanPattern: "ગાગાગાગાગાગાગાગાગાગાગાગાગાગાગા",
    classicalName: "બહરે કામિલ (૧૫ ગુરુ)",
    category: "સર્વગુરુ (All Guru)",
    rukns: ["૧૫ વખત ગા"],
    totalMatras: 30,
    syllableCount: 15,
    description: "૧૫ ગુરુ માત્રાઓની વિશિષ્ટ બહર."
  },
  {
    id: 20,
    title: "છંદ ૨૦ (૮ વખત ગા)",
    pattern: "ગાગાગાગાગાગાગાગા",
    cleanPattern: "ગાગાગાગાગાગાગાગા",
    classicalName: "બહરે મુતદારિક (૮ ગુરુ)",
    category: "સર્વગુરુ (All Guru)",
    rukns: ["ગા ગા", "ગા ગા", "ગા ગા", "ગા ગા"],
    totalMatras: 16,
    syllableCount: 8,
    description: "૮ ગુરુ માત્રા. 'સાંજ પડે ને યાદ તમારી આવે છે' - ટૂંકો અને આકર્ષક."
  },
  {
    id: 21,
    title: "છંદ ૨૧ (૭ વખત ગા)",
    pattern: "ગાગાગાગાગાગાગા",
    cleanPattern: "ગાગાગાગાગાગાગા",
    classicalName: "બહરે મુતદારિક મહઝૂફ (૭ ગુરુ)",
    category: "સર્વગુરુ (All Guru)",
    rukns: ["૭ વખત ગા"],
    totalMatras: 14,
    syllableCount: 7,
    description: "૭ ગુરુ માત્રાઓ ધરાવતી નાની બહર."
  },
  {
    id: 22,
    title: "છંદ ૨૨ (૧૨ વખત ગા)",
    pattern: "ગાગાગાગાગાગાગાગાગાગાગાગા",
    cleanPattern: "ગાગાગાગાગાગાગાગાગાગાગાગા",
    classicalName: "બહરે મુતદારિક મુસદ્દસ (૧૨ ગુરુ)",
    category: "સર્વગુરુ (All Guru)",
    rukns: ["૧૨ વખત ગા"],
    totalMatras: 24,
    syllableCount: 12,
    description: "૧૨ ગુરુ માત્રાઓ ધરાવતી બહર."
  },
  {
    id: 23,
    title: "છંદ ૨૩ (ગાગાલગાલગાગાગા ગાલગાલગાગા)",
    pattern: "ગાગાલગાલગાગાગા ગાલગાલગાગા",
    cleanPattern: "ગાગાલગાલગાગાગાગાલગાલગાગા",
    classicalName: "બહરે રજઝ મુસમ્મન મતવી",
    category: "રજઝ (Rajaz)",
    rukns: ["મુસ્તફઇલુન", "મુસ્તફઇલુન", "મુસ્તફઇલુન"],
    totalMatras: 22,
    syllableCount: 13,
    description: "ધ્વનિ અને ઉછાળવાળી અદભુત પ્રવાહિતા."
  },
  {
    id: 24,
    title: "છંદ ૨૪ (લલગાલગાલગાગા લલગાલગાલગાગા)",
    pattern: "લલગાલગાલગાગા લલગાલગાલગાગા",
    cleanPattern: "લલગાલગાલગાગાલલગાલગાલગાગા",
    classicalName: "બહરે મુતકારિબ મુસમ્મન સાલિમ",
    category: "મુતકારિબ",
    rukns: ["ફઊલુન", "ફઊલુન", "ફઊલુન", "ફઊલુન"],
    totalMatras: 24,
    syllableCount: 14,
    description: "લલના પ્રારંભ સાથે સંગીતમય લયબદ્ધતા સર્જે છે."
  },
  {
    id: 25,
    title: "છંદ ૨૫ (ગાલલગાલગાલગાગા લલગાલગાલગા)",
    pattern: "ગાલલગાલગાલગાગા લલગાલગાલગા",
    cleanPattern: "ગાલલગાલગાલગાગાલલગાલગાલગા",
    classicalName: "બહરે હઝજ મુખ્તલિફ",
    category: "હઝજ",
    rukns: ["મફઊલુ", "મફાઈલુન", "ફઊલુન"],
    totalMatras: 23,
    syllableCount: 14,
    description: "વૈવિધ્યપૂર્ણ લય સંયોજન ધરાવતી બહર."
  },
  {
    id: 26,
    title: "છંદ ૨૬ (ગાલગાલગાલલગાગા લગાલગા)",
    pattern: "ગાલગાલગાલલગાગા લગાલગા",
    cleanPattern: "ગાલગાલગાલલગાગાલગાલગા",
    classicalName: "બહરે મુન્સરીહ મુસદ્દસ",
    category: "મુન્સરીહ",
    rukns: ["મુસ્તફઇલુન", "મફઊલાતુ", "મુસ્તફઇલુન"],
    totalMatras: 20,
    syllableCount: 12,
    description: "વિશિષ્ટ વિરામચિહ્નો સાથે સુંદર પ્રવાહ રચે છે."
  },
  {
    id: 27,
    title: "છંદ ૨૭ (લગાલગાલલગાગા લગાલગા ગાગા)",
    pattern: "લગાલગાલલગાગા લગાલગા ગાગા",
    cleanPattern: "લગાલગાલલગાગાલગાલગાગાગા",
    classicalName: "બહરે મુઝારિ મુસમ્મન મુખ્તલિફ",
    category: "મુઝારિ",
    rukns: ["મફાઈલુન", "ફાઈલાતુન", "મફાઈલુન", "ફઅ"],
    totalMatras: 22,
    syllableCount: 13,
    description: "અંતે ગાગા આવતો હોવાથી રદીફ-કાફિયા સુંદર બેસે છે."
  },
  {
    id: 28,
    title: "છંદ ૨૮ (ગાલગાગાલલગાગાલલગાગા ગાગા)",
    pattern: "ગાલગાગાલલગાગાલલગાગા ગાગા",
    cleanPattern: "ગાલગાગાલલગાગાલલગાગાગાગા",
    classicalName: "બહરે મુતદારિક મુસમ્મન મુરક્કબ",
    category: "મુતદારિક",
    rukns: ["ફાઈલુન", "ફાઈલુન", "ફાઈલુન", "ફઅલ"],
    totalMatras: 24,
    syllableCount: 14,
    description: "પ્રૌઢ અને વિસ્તૃત રચનાઓ માટે અનુકૂળ છંદ."
  },
  {
    id: 29,
    title: "છંદ ૨૯ (ગાલગાગાલલગાગા ગાગા)",
    pattern: "ગાલગાગાલલગાગા ગાગા",
    cleanPattern: "ગાલગાગાલલગાગાગાગા",
    classicalName: "બહરે મુતદારિક મુસદ્દસ મુરક્કબ",
    category: "મુતદારિક",
    rukns: ["ફાઈલુન", "ફાઈલુન", "ગાગા"],
    totalMatras: 18,
    syllableCount: 10,
    description: "મધ્યમ કદની પ્રાસાદિક બહર."
  },
  {
    id: 30,
    title: "છંદ ૩૦ (ગાલગાગાલગાલગા ગાગા)",
    pattern: "ગાલગાગાલગાલગા ગાગા",
    cleanPattern: "ગાલગાગાલગાલગાગાગા",
    classicalName: "બહરે મુતદારિક મુરબ્બા ઝાયદ",
    category: "મુતદારિક",
    rukns: ["ફાઈલુન", "ફઊલુન", "ગાગા"],
    totalMatras: 18,
    syllableCount: 10,
    description: "ઉદય શાહની પુસ્તકનો ૩૦મો છંદ, આકર્ષક પદાવલિ માટે ઉત્તમ."
  }
];
