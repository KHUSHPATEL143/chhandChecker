import React, { useState } from 'react';
import { LineAnalysis, MeterSettings } from '../types/meter';
import {
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  BookMarked,
  Settings,
  HelpCircle,
} from 'lucide-react';
import {
  getChhandCorrectionSuggestions,
  ChhandAiCorrectionResponse,
  getOpenRouterApiKey,
} from '../services/openRouterService';

interface LineAnalysisCardProps {
  line: LineAnalysis;
  targetPattern: string;
  targetTitle: string;
  fullGhazalContext: string;
  settings: MeterSettings;
  onInspectLine?: (line: LineAnalysis) => void;
  onApplyCorrection?: (lineIndex: number, newText: string) => void;
  onOpenAiSettings?: () => void;
}

export const LineAnalysisCard: React.FC<LineAnalysisCardProps> = ({
  line,
  targetPattern,
  targetTitle,
  fullGhazalContext,
  settings,
  onInspectLine,
  onApplyCorrection,
  onOpenAiSettings,
}) => {
  const [showTokenRibbon, setShowTokenRibbon] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<ChhandAiCorrectionResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedLineIndex, setCopiedLineIndex] = useState<number | null>(null);
  const [appliedLineIndex, setAppliedLineIndex] = useState<number | null>(null);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  if (line.words.length === 0) return null;

  const handleFetchAiSuggestions = async () => {
    const key = getOpenRouterApiKey();
    if (!key) {
      setAiError('OpenRouter API Key સેટ કરેલ નથી. કૃપા કરીને સેટિંગ્સમાં જઈને કી દાખલ કરો.');
      setShowAiDrawer(true);
      return;
    }

    setIsLoadingAi(true);
    setAiError(null);
    setShowAiDrawer(true);

    try {
      const result = await getChhandCorrectionSuggestions({
        brokenLine: line.originalText,
        targetPattern,
        targetTitle,
        lineAnalysis: line,
        fullGhazalContext,
        settings,
      });
      setAiResult(result);
    } catch (err: any) {
      setAiError(err.message || 'AI સૂચનો મેળવવામાં ક્ષતિ થઈ.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleApply = (idx: number, correctedText: string) => {
    if (onApplyCorrection) {
      onApplyCorrection(line.lineIndex, correctedText);
      setAppliedLineIndex(idx);
      setTimeout(() => setAppliedLineIndex(null), 2000);
    }
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLineIndex(idx);
    setTimeout(() => setCopiedLineIndex(null), 2000);
  };

  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  return (
    <div
      className={`border rounded-xl p-4 transition-all shadow-2xs ${
        line.isPerfect
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-rose-50/70 border-rose-200'
      }`}
    >
      {/* Top Header of the Line */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 text-xs font-gujarati">
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold px-2 py-0.5 rounded text-xs ${
              line.isPerfect
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            પંક્તિ {line.lineIndex + 1}
          </span>
          <span className="text-slate-600 font-medium">
            {line.isPerfect ? '✅ છંદબદ્ધ' : '❌ છંદભંગ'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-600 font-mono text-xs">
          <span>
            માત્રા: <strong className={line.userMatras === line.targetMatras ? 'text-emerald-700' : 'text-rose-700'}>{line.userMatras}</strong> / {line.targetMatras}
          </span>
          <span className="text-slate-300">|</span>
          <span>
            અક્ષર: <strong>{line.userTokens.length}</strong> / {line.targetTokens.length}
          </span>
        </div>
      </div>

      {/* Main Ghazal Line with Word-by-Word Error Highlighting */}
      <div className="my-2.5 text-xl font-gujarati-serif leading-relaxed flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {line.words.map((w, wIdx) => {
          return (
            <div key={wIdx} className="relative group inline-block">
              <span
                className={`transition-colors rounded-sm px-1 py-0.5 ${
                  w.hasError
                    ? 'text-rose-700 font-bold underline decoration-rose-500 decoration-2 underline-offset-4 bg-rose-100/50'
                    : 'text-emerald-900 font-medium hover:bg-emerald-100/40'
                }`}
              >
                {w.word}
              </span>

              {/* Tooltip on hover */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg pointer-events-none font-gujarati">
                <div className="font-semibold text-sky-300">શબ્દ: {w.word}</div>
                <div>માત્રા સ્વરૂપ: <span className="font-mono text-amber-300">{w.tokens.join('') || '—'}</span></div>
                {w.hasError && w.errorReason && (
                  <div className="text-rose-300 mt-1 text-[11px] border-t border-slate-700 pt-1">
                    ⚠️ {w.errorReason}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 mt-0.5">
                  અક્ષર: {w.syllables.map(s => s.text).join('-')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Derived Meter Breakdown for this Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-gujarati">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-medium">કાઢેલ માત્રા માળખું:</span>
          <div className="font-mono text-sm tracking-wide bg-white/90 px-2 py-0.5 rounded border border-slate-200">
            {line.words.map((w, idx) => (
              <span
                key={idx}
                className={`mr-1.5 ${w.hasError ? 'text-rose-600 font-bold' : 'text-emerald-700'}`}
              >
                {w.tokens.join('') || '—'}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Correction Trigger Button (Highlight if Chhandbhang) */}
          {!line.isPerfect && (
            <button
              type="button"
              onClick={handleFetchAiSuggestions}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg shadow-xs font-semibold text-xs transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>AI છંદ સુધારો અને વિકલ્પો</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowTokenRibbon(!showTokenRibbon)}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200"
          >
            <span>માત્રા સરખામણી</span>
            {showTokenRibbon ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onInspectLine && (
            <button
              type="button"
              onClick={() => onInspectLine(line)}
              className="flex items-center gap-1 text-sky-700 hover:text-sky-900 text-xs px-2.5 py-1 rounded-lg bg-white border border-sky-200"
            >
              <Info className="w-3.5 h-3.5" />
              <span>અક્ષરવાર વિગત</span>
            </button>
          )}
        </div>
      </div>

      {/* Token Alignment Ribbon Comparison */}
      {showTokenRibbon && (
        <div className="mt-3 pt-3 border-t border-black/10 text-xs font-gujarati space-y-2">
          <p className="text-slate-600 font-medium text-[11px]">
            છંદ સાથે અક્ષરે-અક્ષરની તુલના (ટાર્ગેટ vs તમારી રચના):
          </p>
          <div className="overflow-x-auto pb-1">
            <div className="inline-flex gap-1 min-w-full">
              {line.alignments.map((align, aIdx) => {
                let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                let label = 'મેળ';
                if (align.status === 'lal_eq_ga') {
                  badgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
                  label = 'લલ=ગા છૂટ';
                } else if (align.status === 'end_laghu_guru') {
                  badgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
                  label = 'અંત્ય છૂટ';
                } else if (align.status === 'mismatch' || align.status === 'excess') {
                  badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
                  label = 'ભંગ';
                }

                return (
                  <div
                    key={aIdx}
                    className={`flex flex-col items-center justify-center p-1.5 rounded border text-center min-w-[42px] ${badgeClass}`}
                    title={label}
                  >
                    <span className="text-[10px] text-slate-500 font-mono">#{aIdx + 1}</span>
                    <span className="font-mono font-bold text-sm">{align.userToken}</span>
                    <span className="text-[10px] border-t border-current/20 mt-0.5 pt-0.5 font-mono text-slate-700">
                      લક્ષ્ય: {align.targetToken}
                    </span>
                    <span className="text-[9px] opacity-80 mt-0.5">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Summary message */}
      {!line.isPerfect && (
        <div className="mt-2.5 flex items-center justify-between gap-1.5 text-xs text-rose-700 font-gujarati">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{line.summaryMessage}</span>
          </div>
        </div>
      )}

      {/* AI Suggestions Drawer */}
      {showAiDrawer && (
        <div className="mt-4 pt-4 border-t border-indigo-100 bg-white/95 rounded-xl p-4 shadow-sm space-y-4 font-gujarati">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">AI છંદ સુધારા સહાયક</h4>
                <p className="text-[11px] text-slate-500">
                  મૂળ કાવ્યભાવ જાળવીને છંદબદ્ધ વિકલ્પો અને વૈકલ્પિક શબ્દભંડોળ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenAiSettings && (
                <button
                  type="button"
                  onClick={onOpenAiSettings}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                  title="AI સેટિંગ્સ"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAiDrawer(false)}
                className="text-xs text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded"
              >
                બંધ કરો ✕
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingAi && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <Sparkles className="w-4 h-4 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  કાવ્યભાવ અને છંદ નિયમો પ્રમાણે AI વિકલ્પો તૈયાર થઈ રહ્યા છે...
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  મૂળ અર્થ સાચવીને માત્રા માળખું સરખું ગોઠવવામાં આવી રહ્યું છે
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {aiError && !isLoadingAi && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{aiError}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleFetchAiSuggestions}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>ફરી પ્રયાસ કરો</span>
                </button>
                {onOpenAiSettings && (
                  <button
                    type="button"
                    onClick={onOpenAiSettings}
                    className="px-3 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 rounded font-medium flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    <span>API Key / મોડલ તપાસો</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Result State */}
          {aiResult && !isLoadingAi && (
            <div className="space-y-4">
              {/* Prosody Explanation */}
              {aiResult.explanation && (
                <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>પિંગળ વિશ્લેષણ અને સુધારાનું કારણ:</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 pl-5">
                    {aiResult.explanation}
                  </p>
                </div>
              )}

              {/* Corrected Line Options */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-xs text-slate-700 flex items-center gap-1.5">
                    <span>સુધારેલા છંદબદ્ધ વિકલ્પો (Corrected Lines):</span>
                  </h5>
                  <span className="text-[11px] text-slate-400">
                    મોડલ: {aiResult.modelUsed}
                  </span>
                </div>

                <div className="space-y-2">
                  {aiResult.suggestions.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white transition shadow-2xs space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-gujarati-serif text-lg font-medium text-slate-900 group-hover:text-indigo-950">
                              {opt.line}
                            </span>
                            {opt.verifiedPerfect ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>100% છંદબદ્ધ</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded-full flex items-center gap-1">
                                <span>વૈકલ્પિક વજન</span>
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                              {opt.style}
                            </span>
                          </div>

                          {opt.notes && (
                            <p className="text-[11px] text-slate-500">
                              {opt.notes}
                            </p>
                          )}

                          <div className="text-[11px] font-mono text-slate-500 pt-0.5">
                            વજન: <strong className="text-indigo-700">{opt.actualTokens}</strong> ({opt.actualMatras} માત્રા)
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy(oIdx, opt.line)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs transition"
                            title="કોપી કરો"
                          >
                            {copiedLineIndex === oIdx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {onApplyCorrection && (
                            <button
                              type="button"
                              onClick={() => handleApply(oIdx, opt.line)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                                appliedLineIndex === oIdx
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                              }`}
                            >
                              {appliedLineIndex === oIdx ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>લાગુ થઈ ગયું!</span>
                                </>
                              ) : (
                                <>
                                  <span>આ પંક્તિ લાગુ કરો</span>
                                  <ArrowRight className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Vocabulary / Words */}
              {aiResult.suggestedWords && aiResult.suggestedWords.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-xs text-slate-700">
                      ગઝલ સુધાર માટે સૂચવેલા વૈકલ્પિક શબ્દો (Word & Rhyme Bank):
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      શબ્દ પર ક્લિક કરીને કોપી કરો
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {aiResult.suggestedWords.map((item, wIdx) => (
                      <button
                        key={wIdx}
                        type="button"
                        onClick={() => handleCopyWord(item.word)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs transition text-left flex items-center gap-2 group"
                        title="ક્લિક કરીને કોપી કરો"
                      >
                        <span className="font-bold text-slate-800 group-hover:text-indigo-900">
                          {item.word}
                        </span>
                        <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[10px] font-mono text-indigo-600">
                          {item.pattern}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.meaning}
                        </span>
                        {copiedWord === item.word && (
                          <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Refresh button */}
              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleFetchAiSuggestions}
                  className="text-xs text-indigo-700 hover:text-indigo-900 flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>અન્ય વિકલ્પો મેળવો</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};