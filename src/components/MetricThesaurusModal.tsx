import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Filter,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  searchKavyaThesaurus,
  getAiThesaurusSuggestions,
  ThesaurusWord,
} from '../services/kavyaThesaurusService';

interface MetricThesaurusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord?: (word: string) => void;
}

export const MetricThesaurusModal: React.FC<MetricThesaurusModalProps> = ({
  isOpen,
  onClose,
  onSelectWord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('બધા');
  const [selectedPattern, setSelectedPattern] = useState('બધા');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiWords, setAiWords] = useState<ThesaurusWord[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  const categories = ['બધા', 'પ્રેમ', 'દર્દ', 'હૃદય', 'પ્રકૃતિ', 'સૂફી'];
  const patterns = ['બધા', 'ગા', 'લગા', 'ગાગા', 'લગાગા', 'લલલ', 'ગાગાગા'];

  // Local filtered words
  const localWords = useMemo(() => {
    return searchKavyaThesaurus({
      query: searchQuery,
      category: selectedCategory,
      pattern: selectedPattern,
    });
  }, [searchQuery, selectedCategory, selectedPattern]);

  const displayedWords = [...aiWords, ...localWords];

  if (!isOpen) return null;

  const handleCopyWord = (w: string) => {
    navigator.clipboard.writeText(w);
    setCopiedWord(w);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const results = await getAiThesaurusSuggestions(
        searchQuery,
        selectedPattern !== 'બધા' ? selectedPattern : undefined
      );
      setAiWords(results);
    } catch (err: any) {
      setAiError(err.message || 'AI શબ્દ શોધવામાં નિષ્ફળતા.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex max-md:items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs font-gujarati animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600 text-white rounded-xl shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">કાવ્ય શબ્દકોશ અને માત્રા કોશ (Metric Thesaurus)</h3>
              <p className="text-xs text-slate-500">
                લઘુ-ગુરુ વજન અને માત્રા અનુસાર બંધબેસતા ગઝલ શબ્દો
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

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0 text-xs">
          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="શબ્દ અથવા અર્થ શોધો (દા.ત. પ્રેમ, આંસુ, સાંજ, દર્દ)..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAiSearch}
              disabled={aiLoading || !searchQuery.trim()}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-2xs transition"
            >
              {aiLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>AI શોધ</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-medium">વિષય:</span>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition ${
                    selectedCategory === c
                      ? 'bg-amber-700 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Pattern filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-medium">વજન:</span>
              {patterns.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPattern(p)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition ${
                    selectedPattern === p
                      ? 'bg-sky-700 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {aiError && (
            <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {aiError}
            </div>
          )}

          {displayedWords.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              કોઈ શબ્દ મળ્યો નથી. અન્ય કીવર્ડ સર્ચ કરો અથવા ઉપર આપેલ "AI શોધ" બટન દબાવો.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {displayedWords.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 hover:border-amber-300 rounded-xl flex items-start justify-between gap-2 shadow-2xs hover:shadow-xs transition group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base font-gujarati group-hover:text-amber-800">
                        {item.word}
                      </span>
                      <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[10px] font-mono font-bold">
                        {item.pattern}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.matras} માત્રા
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {item.meaning}
                    </p>
                    <span className="inline-block text-[9px] text-slate-400 bg-slate-100 px-1 rounded">
                      #{item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyWord(item.word)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs"
                      title="શબ્દ કોપી કરો"
                    >
                      {copiedWord === item.word ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {onSelectWord && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectWord(item.word);
                          onClose();
                        }}
                        className="px-2 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
                        title="એડિટરમાં ઉમેરો"
                      >
                        + ઉમેરો
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>કુલ {displayedWords.length} શબ્દો ઉપલબ્ધ (ઓફલાઇન સંગ્રહ)</span>
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