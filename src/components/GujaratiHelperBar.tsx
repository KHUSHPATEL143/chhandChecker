import React, { useState } from 'react';
import { Keyboard, ChevronRight, ChevronLeft } from 'lucide-react';

interface GujaratiHelperBarProps {
  onInsertChar: (char: string) => void;
}

export const GujaratiHelperBar: React.FC<GujaratiHelperBarProps> = ({ onInsertChar }) => {
  const commonChars = [
    { label: '્ (જોડાક્ષર)', val: '્', title: 'ખોડો / વિરામ (જોડાક્ષર બનાવવા)' },
    { label: 'ં (અનુસ્વાર)', val: 'ં', title: 'અનુસ્વાર (ગુરુ માત્રા)' },
    { label: 'ઃ (વિસર્ગ)', val: 'ઃ', title: 'વિસર્ગ' },
    { label: 'િ (હ્રસ્વ ઇ)', val: 'િ', title: 'હ્રસ્વ માત્રા (લઘુ)' },
    { label: 'ી (દીર્ઘ ઈ)', val: 'ી', title: 'દીર્ઘ માત્રા (ગુરુ)' },
    { label: 'ુ (હ્રસ્વ ઉ)', val: 'ુ', title: 'હ્રસ્વ ઉ (લઘુ)' },
    { label: 'ૂ (દીર્ઘ ઊ)', val: 'ૂ', title: 'દીર્ઘ ઊ (ગુરુ)' },
    { label: 'ે (એ)', val: 'ે', title: 'એ માત્રા (ગુરુ)' },
    { label: 'ૈ (ઐ)', val: 'ૈ', title: 'ઐ માત્રા (ગુરુ)' },
    { label: 'ો (ઓ)', val: 'ો', title: 'ઓ માત્રા (ગુરુ)' },
    { label: 'ૌ (ઔ)', val: 'ૌ', title: 'ઔ માત્રા (ગુરુ)' },
    { label: 'ા (આ)', val: 'ા', title: 'કાનો (ગુરુ)' },
    { label: 'ઋ', val: 'ઋ', title: 'ઋ અક્ષર (લઘુ)' },
    { label: 'ક્ષ', val: 'ક્ષ', title: 'ક્ષ (ક+્+ષ)' },
    { label: 'જ્ઞ', val: 'જ્ઞ', title: 'જ્ઞ (જ+્+ઞ)' },
  ];

  return (
    <div className="py-1 px-1 sm:px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-1.5 overflow-hidden">
      <div className="flex items-center gap-1 text-slate-500 font-medium whitespace-nowrap pl-1 shrink-0 text-[11px]">
        <Keyboard className="w-3.5 h-3.5 text-sky-600" />
        <span className="hidden sm:inline">ઝડપી માત્રાઓ:</span>
      </div>

      {/* Swipeable horizontal strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 flex-1">
        {commonChars.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onInsertChar(item.val)}
            title={item.title}
            className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-900 border border-slate-200 hover:border-sky-300 rounded-lg text-xs font-gujarati font-medium transition-all active:scale-95 shrink-0 shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};