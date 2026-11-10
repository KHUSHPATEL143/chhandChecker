import React from 'react';
import { LineAnalysis } from '../types/meter';
import { X, CheckCircle, AlertTriangle, Layers } from 'lucide-react';

interface SyllableInspectorModalProps {
  line: LineAnalysis | null;
  onClose: () => void;
}

export const SyllableInspectorModal: React.FC<SyllableInspectorModalProps> = ({ line, onClose }) => {
  if (!line) return null;

  return (
    <div className="fixed inset-0 z-50 flex max-md:items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs font-gujarati">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                પંક્તિ {line.lineIndex + 1} - ઊંડાણપૂર્વક અક્ષરવાર વિશ્લેષણ
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                કુલ માત્રા: {line.userMatras} / {line.targetMatras} · અક્ષરો: {line.userTokens.length} / {line.targetTokens.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Line View */}
        <div className="p-4 bg-sky-50/50 border-b border-slate-200">
          <div className="text-xs text-slate-500 mb-1">મૂળ પંક્તિ:</div>
          <div className="text-lg font-gujarati-serif text-slate-900">
            {line.originalText}
          </div>
        </div>

        {/* Syllable Table */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-4">
            {line.words.map((w, wIdx) => (
              <div
                key={wIdx}
                className={`p-3 rounded-xl border ${
                  w.hasError
                    ? 'border-rose-300 bg-rose-50/40'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900 text-sm font-gujarati-serif">
                    શબ્દ {wIdx + 1}: <span className="text-sky-800">{w.word}</span>
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-slate-200">
                    {w.tokens.join('') || '—'}
                  </span>
                </div>

                {w.errorReason && (
                  <div className="text-xs text-rose-700 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{w.errorReason}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {w.syllables.map((s, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base font-bold text-slate-900 font-gujarati-serif">
                          {s.text}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold ${
                            s.token === 'ગા'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.token} ({s.matras} માત્રા)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {s.ruleExplanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
