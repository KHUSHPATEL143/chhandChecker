import {
  MeterToken,
  SyllableDetail,
  WordAnalysis,
  TokenAlignment,
  LineAnalysis,
  MeterSettings,
} from '../types/meter';

// Independent Gujarati Vowels
const LAGHU_INDEPENDENT_VOWELS = new Set(['અ', 'ઇ', 'ઉ', 'ઋ']);
const GURU_INDEPENDENT_VOWELS = new Set(['આ', 'ઈ', 'ઊ', 'ઍ', 'એ', 'ઐ', 'ઑ', 'ઓ', 'ઔ']);

// Combining Matras
const LAGHU_MATRAS = new Set(['િ', 'ુ', 'ૃ']); // U+0ABF, U+0AC1, U+0AC3
const GURU_MATRAS = new Set(['ા', 'ી', 'ૂ', 'ૄ', 'ૅ', 'ે', 'ૈ', 'ૉ', 'ો', 'ૌ', 'ં', 'ઃ']); // U+0ABE..

const VIRAMA = '્'; // U+0ACD

/**
 * Clean text from punctuation while keeping Gujarati letters and whitespace
 */
export function cleanGujaratiText(text: string): string {
  // Remove common punctuation marks
  return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'‘’“”\[\]।॥\\]/g, ' ');
}

/**
 * Parse tokens (લ and ગા) from a meter string like "લગાગાલગાગા"
 */
export function getTokens(meterStr: string): MeterToken[] {
  const tokens: MeterToken[] = [];
  let i = 0;
  while (i < meterStr.length) {
    if (meterStr[i] === 'ગ' && i + 1 < meterStr.length && meterStr[i + 1] === 'ા') {
      tokens.push('ગા');
      i += 2;
    } else if (meterStr[i] === 'લ') {
      tokens.push('લ');
      i += 1;
    } else {
      i += 1;
    }
  }
  return tokens;
}

/**
 * Format an array of tokens with readable spaces every 3 or 4 tokens, or matching bahar chunks
 */
export function formatTokens(tokens: MeterToken[], groupSize = 4): string {
  const chunks: string[] = [];
  for (let i = 0; i < tokens.length; i += groupSize) {
    chunks.push(tokens.slice(i, i + groupSize).join(''));
  }
  return chunks.join(' ');
}

/**
 * Parse a single Gujarati word into its constituent syllables and meter tokens
 */
export function analyzeWord(word: string): WordAnalysis {
  const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'‘’“”\[\]।॥\\]/g, '').trim();
  if (!clean) {
    return {
      word,
      tokens: [],
      syllables: [],
      hasError: false,
    };
  }

  const syllables: SyllableDetail[] = [];
  let i = 0;

  while (i < clean.length) {
    const char = clean[i];

    // Check if current char is independent vowel
    if (GURU_INDEPENDENT_VOWELS.has(char)) {
      let syllableText = char;
      let nextIdx = i + 1;
      // check if followed by anusvara/visarga
      if (nextIdx < clean.length && (clean[nextIdx] === 'ં' || clean[nextIdx] === 'ઃ')) {
        syllableText += clean[nextIdx];
        nextIdx++;
      }
      syllables.push({
        text: syllableText,
        token: 'ગા',
        matras: 2,
        ruleExplanation: 'દીર્ઘ સ્વર (સ્વતંત્ર ગુરુ સ્વર)',
      });
      i = nextIdx;
      continue;
    }

    if (LAGHU_INDEPENDENT_VOWELS.has(char)) {
      let syllableText = char;
      let nextIdx = i + 1;
      let isGuruByAnusvara = false;
      if (nextIdx < clean.length && (clean[nextIdx] === 'ં' || clean[nextIdx] === 'ઃ')) {
        syllableText += clean[nextIdx];
        isGuruByAnusvara = true;
        nextIdx++;
      }
      syllables.push({
        text: syllableText,
        token: isGuruByAnusvara ? 'ગા' : 'લ',
        matras: isGuruByAnusvara ? 2 : 1,
        ruleExplanation: isGuruByAnusvara ? 'અનુસ્વાર/વિસર્ગથી ગુરુ' : 'હ્રસ્વ સ્વર',
      });
      i = nextIdx;
      continue;
    }

    // Check if character is a Gujarati consonant
    if (char >= 'અ' && char <= 'હ') {
      // Check if followed by virama (forming a conjunct)
      if (i + 1 < clean.length && clean[i + 1] === VIRAMA) {
        // This is a half-consonant part of a conjunct!
        // Rule: જોડાક્ષરનો થડકારો - It stresses the previous syllable, turning a Laghu into Guru
        if (syllables.length > 0 && syllables[syllables.length - 1].token === 'લ') {
          syllables[syllables.length - 1].token = 'ગા';
          syllables[syllables.length - 1].matras = 2;
          syllables[syllables.length - 1].isStressedByConjunct = true;
          syllables[syllables.length - 1].ruleExplanation = 'જોડાક્ષરનો થડકારો (પાછળ અર્ધ અક્ષર આવવાથી લઘુનો ગુરુ)';
        }

        // Now collect the full conjunct text
        let conjunctCluster = char + VIRAMA;
        let cIdx = i + 2;
        // There could be multiple conjuncts like સ્ત્ર, ર્દ્વ
        while (cIdx + 1 < clean.length && clean[cIdx + 1] === VIRAMA) {
          conjunctCluster += clean[cIdx] + VIRAMA;
          cIdx += 2;
        }

        if (cIdx < clean.length && clean[cIdx] >= 'અ' && clean[cIdx] <= 'હ') {
          conjunctCluster += clean[cIdx];
          cIdx++;

          // Check matras on the final consonant of the conjunct
          let token: MeterToken = 'લ';
          let matras: 1 | 2 = 1;
          let rule = 'જોડાક્ષર મૂળ અક્ષર (હ્રસ્વ)';

          if (cIdx < clean.length && GURU_MATRAS.has(clean[cIdx])) {
            conjunctCluster += clean[cIdx];
            token = 'ગા';
            matras = 2;
            rule = 'જોડાક્ષર સાથે દીર્ઘ માત્રા/અનુસ્વાર';
            cIdx++;
            // Check for additional anusvara after matra (e.g. માં, ક્યાં)
            if (cIdx < clean.length && clean[cIdx] === 'ં') {
              conjunctCluster += clean[cIdx];
              cIdx++;
            }
          } else if (cIdx < clean.length && LAGHU_MATRAS.has(clean[cIdx])) {
            conjunctCluster += clean[cIdx];
            token = 'લ';
            matras = 1;
            rule = 'જોડાક્ષર સાથે હ્રસ્વ માત્રા';
            cIdx++;
            if (cIdx < clean.length && clean[cIdx] === 'ં') {
              conjunctCluster += clean[cIdx];
              token = 'ગા';
              matras = 2;
              rule = 'જોડાક્ષર પર અનુસ્વાર';
              cIdx++;
            }
          }

          syllables.push({
            text: conjunctCluster,
            token,
            matras,
            ruleExplanation: rule,
          });
          i = cIdx;
          continue;
        } else {
          // Dangling virama at end of word
          i += 2;
          continue;
        }
      }

      // Consonant not followed by virama
      let syllableText = char;
      let nextIdx = i + 1;
      let token: MeterToken = 'લ';
      let matras: 1 | 2 = 1;
      let rule = 'સાદો વ્યંજન (હ્રસ્વ)';

      if (nextIdx < clean.length && GURU_MATRAS.has(clean[nextIdx])) {
        syllableText += clean[nextIdx];
        token = 'ગા';
        matras = 2;
        rule = clean[nextIdx] === 'ં' ? 'અનુસ્વારથી ગુરુ' : 'દીર્ઘ માત્રાથી ગુરુ';
        nextIdx++;

        // Could also have anusvara after a vowel sign, e.g. 'માં', 'પ્રેમમાં', 'કહીં'
        if (nextIdx < clean.length && clean[nextIdx] === 'ં') {
          syllableText += clean[nextIdx];
          nextIdx++;
        }
      } else if (nextIdx < clean.length && LAGHU_MATRAS.has(clean[nextIdx])) {
        syllableText += clean[nextIdx];
        token = 'લ';
        matras = 1;
        rule = 'હ્રસ્વ માત્રા';
        nextIdx++;

        // Check if followed by anusvara (e.g. 'બિંદુ' -> બિં is Guru)
        if (nextIdx < clean.length && clean[nextIdx] === 'ં') {
          syllableText += clean[nextIdx];
          token = 'ગા';
          matras = 2;
          rule = 'હ્રસ્વ માત્રા + અનુસ્વાર (ગુરુ)';
          nextIdx++;
        }
      }

      syllables.push({
        text: syllableText,
        token,
        matras,
        ruleExplanation: rule,
      });
      i = nextIdx;
      continue;
    }

    // Skip any non-Gujarati or unknown symbols
    i++;
  }

  const tokens = syllables.map((s) => s.token);

  return {
    word,
    tokens,
    syllables,
    hasError: false,
  };
}

/**
 * Main line analysis algorithm implementing Pingal Shastra matching,
 * including 'લલ = ગા' छूट, ending laghu as guru छूट, and precise error tracking.
 */
export function analyzeLine(
  lineText: string,
  targetPattern: string,
  settings: MeterSettings,
  lineIndex = 0
): LineAnalysis {
  const trimmed = lineText.trim();
  const rawWords = trimmed.split(/\s+/).filter(Boolean);

  const targetTokens = getTokens(targetPattern);
  const targetMatras = targetTokens.reduce((sum, t) => sum + (t === 'ગા' ? 2 : 1), 0);

  if (rawWords.length === 0) {
    return {
      lineIndex,
      originalText: lineText,
      words: [],
      userTokens: [],
      targetTokens,
      alignments: [],
      isPerfect: false,
      userMatras: 0,
      targetMatras,
      errorWordsCount: 0,
      summaryMessage: 'પંક્તિ ખાલી છે',
    };
  }

  // Analyze each word
  const wordsAnalysis: WordAnalysis[] = rawWords.map((w) => analyzeWord(w));

  // Flatten user tokens with word index
  const flattenedUser: { token: MeterToken; wordIndex: number; syllableIndex: number; tokenIndex: number }[] = [];
  wordsAnalysis.forEach((w, wIdx) => {
    w.tokens.forEach((t, tIdx) => {
      flattenedUser.push({
        token: t,
        wordIndex: wIdx,
        syllableIndex: tIdx,
        tokenIndex: flattenedUser.length,
      });
    });
  });

  const userTokens = flattenedUser.map((f) => f.token);
  const userMatras = userTokens.reduce((sum, t) => sum + (t === 'ગા' ? 2 : 1), 0);

  const errorWordIndices = new Set<number>();
  const alignments: TokenAlignment[] = [];

  let uIdx = 0;
  let tIdx = 0;

  while (uIdx < flattenedUser.length && tIdx < targetTokens.length) {
    const uItem = flattenedUser[uIdx];
    const uTok = uItem.token;
    const tTok = targetTokens[tIdx];

    if (uTok === tTok) {
      // Direct Match
      alignments.push({
        userToken: uTok,
        targetToken: tTok,
        status: 'match',
        wordIndex: uItem.wordIndex,
        userTokenIndex: uIdx,
        targetTokenIndex: tIdx,
      });
      uIdx++;
      tIdx++;
    } else if (tTok === 'ગા' && uTok === 'લ') {
      // Case A: Rule 1 - લલ = ગા ની છૂટછાટ (Two laghus substitute for one guru)
      if (
        settings.allowLalEqGa &&
        uIdx + 1 < flattenedUser.length &&
        flattenedUser[uIdx + 1].token === 'લ'
      ) {
        alignments.push({
          userToken: 'લ',
          targetToken: 'ગા',
          status: 'lal_eq_ga',
          wordIndex: uItem.wordIndex,
          userTokenIndex: uIdx,
          targetTokenIndex: tIdx,
        });
        alignments.push({
          userToken: 'લ',
          targetToken: 'ગા',
          status: 'lal_eq_ga',
          wordIndex: flattenedUser[uIdx + 1].wordIndex,
          userTokenIndex: uIdx + 1,
          targetTokenIndex: tIdx,
        });
        uIdx += 2;
        tIdx += 1;
      }
      // Case B: Rule 2 - પંક્તિના અંતે 'લ' ને 'ગા' ગણવાની છૂટ (End laghu as guru)
      else if (
        settings.allowEndLaghuAsGuru &&
        uIdx === flattenedUser.length - 1 &&
        tIdx === targetTokens.length - 1
      ) {
        alignments.push({
          userToken: 'લ',
          targetToken: 'ગા',
          status: 'end_laghu_guru',
          wordIndex: uItem.wordIndex,
          userTokenIndex: uIdx,
          targetTokenIndex: tIdx,
        });
        uIdx += 1;
        tIdx += 1;
      } else {
        // Mismatch
        errorWordIndices.add(uItem.wordIndex);
        wordsAnalysis[uItem.wordIndex].errorReason = `અહીં 'ગા' (ગુરુ) ની જરૂર હતી પણ 'લ' (લઘુ) મળ્યો.`;
        alignments.push({
          userToken: uTok,
          targetToken: tTok,
          status: 'mismatch',
          wordIndex: uItem.wordIndex,
          userTokenIndex: uIdx,
          targetTokenIndex: tIdx,
        });
        uIdx += 1;
        tIdx += 1;
      }
    } else {
      // Mismatch: e.g. target was 'લ' but user wrote 'ગા'
      errorWordIndices.add(uItem.wordIndex);
      wordsAnalysis[uItem.wordIndex].errorReason = `અહીં '${tTok}' ની જરૂર હતી પણ '${uTok}' મળ્યો.`;
      alignments.push({
        userToken: uTok,
        targetToken: tTok,
        status: 'mismatch',
        wordIndex: uItem.wordIndex,
        userTokenIndex: uIdx,
        targetTokenIndex: tIdx,
      });
      uIdx += 1;
      tIdx += 1;
    }
  }

  // Check for excess user syllables
  while (uIdx < flattenedUser.length) {
    const uItem = flattenedUser[uIdx];
    errorWordIndices.add(uItem.wordIndex);
    wordsAnalysis[uItem.wordIndex].errorReason = `પંક્તિમાં છંદ કરતાં વધારાના અક્ષર છે.`;
    alignments.push({
      userToken: uItem.token,
      targetToken: 'લ', // dummy
      status: 'excess',
      wordIndex: uItem.wordIndex,
      userTokenIndex: uIdx,
    });
    uIdx++;
  }

  // Check for missing syllables (user line ended too soon)
  if (tIdx < targetTokens.length && rawWords.length > 0) {
    const lastWordIdx = rawWords.length - 1;
    errorWordIndices.add(lastWordIdx);
    const existingReason = wordsAnalysis[lastWordIdx].errorReason;
    wordsAnalysis[lastWordIdx].errorReason = existingReason
      ? `${existingReason} (તેમજ પંક્તિમાં ${targetTokens.length - tIdx} અક્ષરો ઘટે છે)`
      : `પંક્તિમાં છંદ મુજબ ${targetTokens.length - tIdx} અક્ષરો ખૂટે છે.`;
  }

  // Mark error on wordsAnalysis
  errorWordIndices.forEach((idx) => {
    if (wordsAnalysis[idx]) {
      wordsAnalysis[idx].hasError = true;
    }
  });

  const isPerfect = errorWordIndices.size === 0 && tIdx === targetTokens.length && uIdx === flattenedUser.length;

  let summaryMessage = '';
  if (isPerfect) {
    summaryMessage = 'છંદબદ્ધ - બિલકુલ યોગ્ય માત્રા અને વજન!';
  } else if (errorWordIndices.size > 0) {
    summaryMessage = `છંદભંગ: ${errorWordIndices.size} શબ્દ${errorWordIndices.size > 1 ? 'ો' : ''}માં માત્રાની વિસંગતતા છે.`;
  } else if (tIdx < targetTokens.length) {
    summaryMessage = `પંક્તિ અધૂરી છે (${targetTokens.length - tIdx} અક્ષર ઘટે છે).`;
  } else {
    summaryMessage = 'છંદભંગ જણાય છે.';
  }

  return {
    lineIndex,
    originalText: lineText,
    words: wordsAnalysis,
    userTokens,
    targetTokens,
    alignments,
    isPerfect,
    userMatras,
    targetMatras,
    errorWordsCount: errorWordIndices.size,
    summaryMessage,
  };
}
