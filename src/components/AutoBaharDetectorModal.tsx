import React, { useMemo } from 'react';
import { X, Search, CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { BaharDef, MeterSettings } from '../types/meter';
import { detectBestMatchingBahars } from '../utils/autoBaharDetector';

interface AutoBaharDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  ghazalText: string;
  settings: MeterSettings;
  onSelectBahar: (bahar: BaharDef) => void;
}

export const AutoBaharDetectorModal: React.FC<AutoBaharDetectorModalProps> = ({
  isOpen,
  onClose,
  ghazalText,
  settings,
  onSelectBahar,
}) => {
  const matches = useMemo(() => {
    if (!isOpen || !ghazalText.trim()) return [];
    return detectBestMatchingBahars(ghazalText, settings, 6);
  }, [isOpen, ghazalText, settings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex max-md:items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs font-gujarati animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-600 text-white rounded-xl shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">ઓટો છંદ ડિટેક્ટર (Auto Meter Detector)</h3>
              <p className="text-xs text-slate-500">
                તમારી રચના ૩૦ છંદો સામે તપાસીને સૌથી નજીકનો છંદ શોધી આપશે
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {!ghazalText.trim() ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              પહેલા એડિટરમાં તમારી ગઝલની થોડી પંક્તિઓ લખો અથવા પેસ્ટ કરો.
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              કોઈ યોગ્ય છંદ મેળવી શકાયો નથી.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 font-medium pb-1 flex items-center justify-between">
                <span>સૌથી વધુ મેળ ખાતા છંદોની યાદી:</span>
                <span className="text-[11px] text-sky-700 font-semibold">
                  ટોપ {matches.length} પરિણામ
                </span>
              </div>

              {matches.map((res, idx) => {
                const isBest = idx === 0;
                let barColor = 'bg-slate-200';
                let textColor = 'text-slate-700';

                if (res.matchScore >= 80) {
                  barColor = 'bg-emerald-500';
                  textColor = 'text-emerald-800';
                } else if (res.matchScore >= 60) {
                  barColor = 'bg-sky-500';
                  textColor = 'text-sky-800';
                } else {
                  barColor = 'bg-amber-500';
                  textColor = 'text-amber-800';
                }

                return (
                  <div
                    key={res.bahar.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isBest
                        ? 'border-sky-300 bg-sky-50/50 shadow-xs ring-1 ring-sky-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900 font-gujarati">
                            {res.bahar.title}
                          </span>
                          {isBest && (
                            <span className="px-2 py-0.5 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                              <span>શ્રેષ્ઠ મેળ</span>
                            </span>
                          )}
                          <span className={`text-xs font-mono font-bold ${textColor}`}>
                            {res.matchScore}% મેળ
                          </span>
                        </div>

                        {/* Progress meter bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${res.matchScore}%` }}
                          />
                        </div>

                        <div className="text-xs font-mono text-slate-600 pt-1">
                          વજન: <b className="text-sky-900">{res.bahar.pattern}</b>
                        </div>

                        <p className="text-[11px] text-slate-500 pt-0.5">
                          {res.explanation} · {res.bahar.classicalName}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectBahar(res.bahar);
                          onClose();
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition active:scale-95 ${
                          isBest
                            ? 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200'
                        }`}
                      >
                        <span>આ છંદ પસંદ કરો</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>પિંગળશાસ્ત્ર અલ્ગોરિધમ દ્વારા ગણતરી</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};