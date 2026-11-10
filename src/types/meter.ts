export type MeterToken = 'લ' | 'ગા';

export interface SyllableDetail {
  text: string;
  token: MeterToken;
  matras: 1 | 2;
  ruleExplanation: string;
  isStressedByConjunct?: boolean;
}

export interface WordAnalysis {
  word: string;
  tokens: MeterToken[];
  syllables: SyllableDetail[];
  hasError: boolean;
  errorReason?: string;
}

export interface TokenAlignment {
  userToken: MeterToken;
  targetToken: MeterToken;
  status: 'match' | 'lal_eq_ga' | 'end_laghu_guru' | 'mismatch' | 'excess' | 'missing';
  wordIndex: number;
  userTokenIndex: number;
  targetTokenIndex?: number;
}

export interface LineAnalysis {
  lineIndex: number;
  originalText: string;
  words: WordAnalysis[];
  userTokens: MeterToken[];
  targetTokens: MeterToken[];
  alignments: TokenAlignment[];
  isPerfect: boolean;
  userMatras: number;
  targetMatras: number;
  errorWordsCount: number;
  summaryMessage: string;
}

export interface BaharDef {
  id: number;
  title: string;
  pattern: string; // e.g. "લગાગા લગાગા લગાગા લગાગા"
  cleanPattern: string; // e.g. "લગાગાલગાગાલગાગાલગાગા"
  category?: string;
  classicalName?: string;
  rukns?: string[]; // e.g. ["મફાઈલુન", "મફાઈલુન", "મફાઈલુન", "મફાઈલુન"]
  totalMatras: number;
  syllableCount: number;
  description?: string;
}

export interface MeterSettings {
  allowLalEqGa: boolean;       // નિયમ ૧: લલ = ગા ની છૂટછાટ
  allowEndLaghuAsGuru: boolean; // નિયમ ૨: પંક્તિના અંતે લઘુને ગુરુ ગણવાની છૂટ
  showSyllableBreakdown: boolean;
}
