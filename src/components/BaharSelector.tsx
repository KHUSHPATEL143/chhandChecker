import React, { useState } from 'react';
import { BAHAR_DATABASE, calculateMatrasFromPattern } from '../data/baharDatabase';
import { BaharDef } from '../types/meter';
import { Search, Sparkles, BookOpen, SlidersHorizontal, PlusCircle } from 'lucide-react';

interface BaharSelectorProps {
  selectedBahar: BaharDef;
  onSelectBahar: (bahar: BaharDef) => void;
  isCustomMode: boolean;
  setIsCustomMode: (isCustom: boolean) => void;
  customPattern: string;
  setCustomPattern: (pattern: string) => void;
  onOpenGuide: () => void;
}

export const BaharSelector: React.FC<BaharSelectorProps> = ({
  selectedBahar,
  onSelectBahar,
  isCustomMode,
  setIsCustomMode,
  customPattern,
  setCustomPattern,
  onOpenGuide,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('બધા');

  const categories = ['બધા', 'હઝજ (Hazaj)', 'રમલ (Ramal)', 'મુતકારિબ (Mutaqarib)', 'સર્વગુરુ (All Guru)', 'અન્ય'];

  const filteredBahars = BAHAR_DATABASE.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.classicalName && b.classicalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.id.toString() === searchTerm.trim();

    if (selectedCategory === 'બધા') return matchesSearch;
    if (selectedCategory === 'અન્ય') {
      return (
        matchesSearch &&
        !b.category?.includes('હઝજ') &&
        !b.category?.includes('રમલ') &&
        !b.category?.includes('મુતકારિબ') &&
        !b.category?.includes('સર્વગુરુ')
      );
    }
    return matchesSearch && b.category?.includes(selectedCategory.split(' ')[0]);
  });

  const customCalculated = calculateMatrasFromPattern(customPattern);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 font-gujarati flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-600" />
            ૧. છંદ (બહર) પસંદગી
          </h2>
          <p className="text-xs text-slate-500 font-gujarati">
            ઉદય શાહના ૩૦ છંદો અથવા કસ્ટમ મીટર
          </p>
        </div>
        <button
          onClick={onOpenGuide}
          className="text-xs text-sky-700 hover:text-sky-900 hover:underline font-medium font-gujarati flex items-center gap-1"
        >
          <span>પિંગળશાસ્ત્ર નિયમો</span>
        </button>
      </div>

      {/* Mode Switcher: 30 Preset vs Custom */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium font-gujarati">
        <button
          onClick={() => setIsCustomMode(false)}
          className={`flex-1 py-1.5 px-3 rounded-md transition-colors text-center ${
            !isCustomMode
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ૩૦ પ્રમાણિત છંદો (પુસ્તક આધારિત)
        </button>
        <button
          onClick={() => setIsCustomMode(true)}
          className={`flex-1 py-1.5 px-3 rounded-md transition-colors text-center ${
            isCustomMode
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          સ્વતંત્ર / કસ્ટમ છંદ
        </button>
      </div>

      {!isCustomMode ? (
        <>
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="છંદ નંબર, નામ અથવા માત્રા શોધો (દા.ત. ૧, લગાગા, રમલ)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-gujarati placeholder:text-slate-400"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors font-gujarati ${
                  selectedCategory === cat
                    ? 'bg-sky-100 text-sky-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dropdown Select & List */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 font-gujarati block">
              પસંદ કરેલો છંદ:
            </label>
            <select
              value={selectedBahar.id}
              onChange={(e) => {
                const found = BAHAR_DATABASE.find((b) => b.id === Number(e.target.value));
                if (found) onSelectBahar(found);
              }}
              className="w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-gujarati text-slate-800"
            >
              {filteredBahars.map((bahar) => (
                <option key={bahar.id} value={bahar.id}>
                  {bahar.title}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Bahar Card */}
          <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-lg space-y-2 text-xs font-gujarati">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sky-950 text-sm">
                {selectedBahar.title}
              </span>
              <span className="text-sky-800 font-mono font-medium">
                {selectedBahar.totalMatras} માત્રા · {selectedBahar.syllableCount} અક્ષર
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded border border-sky-100 text-slate-900 font-mono tracking-wider text-sm font-semibold">
              {selectedBahar.pattern}
            </div>

            {selectedBahar.classicalName && (
              <p className="text-sky-900">
                <span className="font-medium text-sky-950">શાસ્ત્રીય નામ: </span>
                {selectedBahar.classicalName}
              </p>
            )}

            {selectedBahar.rukns && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-slate-500 font-medium">રૂકન:</span>
                {selectedBahar.rukns.map((r, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700"
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}

            {selectedBahar.description && (
              <p className="text-slate-600 italic pt-1 border-t border-sky-100">
                {selectedBahar.description}
              </p>
            )}
          </div>
        </>
      ) : (
        /* Custom Bahar Builder */
        <div className="space-y-3 font-gujarati">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              તમારો કસ્ટમ છંદ દાખલ કરો:
            </label>
            <input
              type="text"
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              placeholder="દા.ત. લગાગા લગાગા લગા અથવા ગાગાલલ ગાગાલલ"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Quick builder buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500">ઝડપી બિલ્ડર:</span>
            <button
              type="button"
              onClick={() => setCustomPattern(customPattern + 'લ')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded font-bold text-xs"
            >
              + લ (૧ માત્રા)
            </button>
            <button
              type="button"
              onClick={() => setCustomPattern(customPattern + 'ગા')}
              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 rounded font-bold text-xs"
            >
              + ગા (૨ માત્રા)
            </button>
            <button
              type="button"
              onClick={() => setCustomPattern(customPattern + ' ')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs"
            >
              સ્પેસ (વિરામ)
            </button>
            <button
              type="button"
              onClick={() => setCustomPattern('')}
              className="px-2 py-1 text-slate-500 hover:text-red-600 text-xs ml-auto"
            >
              સાફ કરો
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex justify-between items-center text-slate-700">
              <span>કુલ માત્રા: <b>{customCalculated.matras}</b></span>
              <span>અક્ષરો: <b>{customCalculated.count}</b></span>
            </div>
            <div className="font-mono text-slate-800 text-sm tracking-wider font-semibold">
              {customPattern || '(કોઈ પેટર્ન દાખલ કરેલ નથી)'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
