import { BAHAR_DATABASE } from '../data/baharDatabase';
import { BaharDef, MeterSettings, MeterToken } from '../types/meter';
import { analyzeLine, getTokens } from './pingalEngine';

export interface BaharMatchResult {
  bahar: BaharDef;
  matchScore: number; // 0 to 100%
  matchingLinesCount: number;
  totalLinesCount: number;
  averageMatraDiff: number;
  explanation: string;
}

/**
 * Calculates match percentage between user line tokens and target bahar tokens
 */
function calculateTokenSimilarity(userTokens: MeterToken[], targetTokens: MeterToken[]): number {
  if (userTokens.length === 0 || targetTokens.length === 0) return 0;

  let directMatches = 0;
  const minLen = Math.min(userTokens.length, targetTokens.length);
  for (let i = 0; i < minLen; i++) {
    if (userTokens[i] === targetTokens[i]) {
      directMatches++;
    }
  }

  // Length difference penalty
  const lengthDiff = Math.abs(userTokens.length - targetTokens.length);
  const rawRatio = directMatches / Math.max(userTokens.length, targetTokens.length);
  const penalty = Math.min(0.3, lengthDiff * 0.05);

  return Math.max(0, rawRatio - penalty);
}

/**
 * Auto-detect which of the 30 Bahars in the database best matches the user's poem
 */
export function detectBestMatchingBahars(
  ghazalText: string,
  settings: MeterSettings,
  topN = 5
): BaharMatchResult[] {
  const lines = ghazalText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const results: BaharMatchResult[] = [];

  for (const bahar of BAHAR_DATABASE) {
    let totalScoreSum = 0;
    let perfectLines = 0;
    let totalMatraDiffSum = 0;

    for (let idx = 0; idx < lines.length; idx++) {
      const lineAnalysis = analyzeLine(lines[idx], bahar.cleanPattern, settings, idx);

      if (lineAnalysis.isPerfect) {
        perfectLines++;
        totalScoreSum += 1.0;
      } else {
        const similarity = calculateTokenSimilarity(
          lineAnalysis.userTokens,
          lineAnalysis.targetTokens
        );
        totalScoreSum += similarity;
      }

      totalMatraDiffSum += Math.abs(lineAnalysis.userMatras - lineAnalysis.targetMatras);
    }

    const averageSimilarity = totalScoreSum / lines.length;
    const matchScore = Math.round(averageSimilarity * 100);
    const averageMatraDiff = Math.round((totalMatraDiffSum / lines.length) * 10) / 10;

    let explanation = '';
    if (matchScore >= 90) {
      explanation = `અતિ ઉત્તમ મેળ (${matchScore}%). ${perfectLines}/${lines.length} પંક્તિઓ સંપૂર્ણ છંદબદ્ધ છે.`;
    } else if (matchScore >= 75) {
      explanation = `ખૂબ સારો મેળ (${matchScore}%). થોડા લઘુ-ગુરુ અક્ષરો સુધારવાથી આખી ગઝલ બેસી જશે.`;
    } else if (matchScore >= 50) {
      explanation = `મધ્યમ મેળ (${matchScore}%). માત્રા તફાવત લગભગ ${averageMatraDiff} છે.`;
    } else {
      explanation = `ઓછો મેળ (${matchScore}%).`;
    }

    results.push({
      bahar,
      matchScore,
      matchingLinesCount: perfectLines,
      totalLinesCount: lines.length,
      averageMatraDiff,
      explanation,
    });
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results.slice(0, topN);
}