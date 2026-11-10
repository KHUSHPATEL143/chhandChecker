import React, { useState } from 'react';
import { BAHAR_DATABASE } from '../data/baharDatabase';
import { X, BookMarked, Check, Lightbulb } from 'lucide-react';

interface PingalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBahar?: (baharId: number) => void;
}

export const PingalGuideModal: React.FC<PingalGuideModalProps> = ({ isOpen, onClose, onSelectBahar }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'bahars' | 'ganas'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex max-md:items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs font-gujarati">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                ગુજરાતી પિંગળશાસ્ત્ર અને ગઝલ છંદ માર્ગદર્શિકા
              </h3>
              <p className="text-xs text-slate-500">
                ઉદય શાહની પુસ્તક અને શાસ્ત્રીય માત્રામેળ/અક્ષરમેળ નિયમો
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-4 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'rules'
                ? 'border-sky-600 text-sky-800 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            મુખ્ય નિયમો (લઘુ, ગુરુ, જોડાક્ષર)
          </button>
          <button
            onClick={() => setActiveTab('bahars')}
            className={`py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'bahars'
                ? 'border-sky-600 text-sky-800 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ૩૦ છંદોની સંપૂર્ણ સૂચિ
          </button>
          <button
            onClick={() => setActiveTab('ganas')}
            className={`py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'ganas'
                ? 'border-sky-600 text-sky-800 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            યમાતારાજભાનસલગાં (૮ ગણ)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 text-sm space-y-5">
          {activeTab === 'rules' && (
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200/80">
                <h4 className="font-semibold text-sky-950 text-sm mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-sky-600" />
                  ૧. લઘુ અને ગુરુની મૂળભૂત ઓળખ:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>
                    <b>લઘુ ('લ' - ૧ માત્રા):</b> હ્રસ્વ સ્વરો (અ, ઇ, ઉ, ઋ) અથવા કોઈ માત્રા વગરના વ્યંજનો (ક, ખ, ગ...) તેમજ હ્રસ્વ માત્રાવાળા અક્ષરો (િ, ુ, ૃ) લઘુ ગણાય છે.
                  </li>
                  <li>
                    <b>ગુરુ ('ગા' - ૨ માત્રા):</b> દીર્ઘ સ્વરો (આ, ઈ, ઊ, એ, ઐ, ઓ, ઔ) અથવા દીર્ઘ માત્રાવાળા અક્ષરો (ા, ી, ૂ, ે, ૈ, ો, ૌ) ગુરુ ગણાય છે.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80">
                <h4 className="font-semibold text-amber-950 text-sm mb-2">
                  ૨. જોડાક્ષરનો થડકારો (Virama Stress Rule):
                </h4>
                <p className="text-xs mb-2">
                  જ્યારે કોઈ લઘુ અક્ષર પછી જોડાક્ષર (અડધો અક્ષર) આવે, ત્યારે જોડાક્ષરના થડકારાને કારણે આગળનો લઘુ અક્ષર ગુરુ ('ગા') બની જાય છે.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <span className="font-semibold text-slate-900">સત્ય:</span> સ (લ $\to$ ગા), ત્ય (લ) = <b>ગા લ</b>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <span className="font-semibold text-slate-900">શબ્દ:</span> શ (લ $\to$ ગા), બ્દ (લ) = <b>ગા લ</b>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <span className="font-semibold text-slate-900">કર્મ:</span> ક (લ $\to$ ગા), ર્મ (લ) = <b>ગા લ</b>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <span className="font-semibold text-slate-900">સ્નેહ:</span> સ્ને (ગા), હ (લ) = <b>ગા લ</b>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80">
                <h4 className="font-semibold text-emerald-950 text-sm mb-2">
                  ૩. અનુસ્વાર અને વિસર્ગના નિયમો:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>
                    <b>તીવ્ર અનુસ્વાર (ં):</b> અક્ષર પર જો તીવ્ર અનુસ્વાર હોય તો તે હંમેશા ગુરુ ('ગા') બને છે. (દા.ત. અંત, ચંદન, બિંદુ).
                  </li>
                  <li>
                    <b>વિસર્ગ (ઃ):</b> વિસર્ગવાળો અક્ષર પણ ગુરુ ('ગા') ગણાય છે. (દા.ત. દુઃખ = ગા લ).
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200/80">
                <h4 className="font-semibold text-purple-950 text-sm mb-2">
                  ૪. ગઝલ પિંગળની પરંપરાગત છૂટછાટો:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>
                    <b>નિયમ ૧ - લલ = ગા ની છૂટ:</b> ગઝલના મીટરમાં જ્યાં એક ગુરુ ('ગા') આવતો હોય ત્યાં બે લઘુ ('લલ') મૂકવાની માન્યતા પ્રાપ્ત છૂટ છે (ખાસ કરીને ફાઈલાતુન / મુતફાઈલુન વગેરેમાં).
                  </li>
                  <li>
                    <b>નિયમ ૨ - પંક્તિના અંતે લઘુને ગુરુ ગણવાની છૂટ:</b> કોઈપણ ગઝલની પંક્તિ (મિસરા) ના છેલ્લા અક્ષર તરીકે જો લઘુ આવે, તો તેને છંદની પૂર્ણાહુતિ માટે ગુરુ ગણી શકાય છે.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'bahars' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                નીચે ઉદય શાહની પુસ્તક આધારિત તમામ ૩૦ છંદોની સૂચિ છે. તમે કોઈપણ છંદ પર ક્લિક કરીને તેને સીધો પસંદ કરી શકો છો:
              </p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {BAHAR_DATABASE.map((bahar) => (
                  <div
                    key={bahar.id}
                    className="p-3 hover:bg-sky-50/60 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 font-gujarati">
                        {bahar.title}
                      </div>
                      <div className="font-mono text-sky-800 text-[11px]">
                        {bahar.pattern}
                      </div>
                      {bahar.classicalName && (
                        <div className="text-[11px] text-slate-500">
                          {bahar.classicalName}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {bahar.totalMatras} માત્રા
                      </span>
                      {onSelectBahar && (
                        <button
                          onClick={() => {
                            onSelectBahar(bahar.id);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium"
                        >
                          પસંદ કરો
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ganas' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-100 rounded-xl font-mono text-sm text-center tracking-widest font-bold text-slate-800">
                ય મા તા રા જ ભા ન સ લ ગાં
              </div>
              <p className="text-slate-600">
                ભારતીય છંદશાસ્ત્રમાં ૮ ગણો પ્રત્યેક ૩ અક્ષરોના સમૂહથી બને છે:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: 'યગણ (ય)', pattern: 'લગાગા', desc: 'યમાતા (૧-૨-૨)' },
                  { name: 'મગણ (મ)', pattern: 'ગાગાગા', desc: 'માતારા (૨-૨-૨)' },
                  { name: 'તગણ (ત)', pattern: 'ગાગાલ', desc: 'તારાજ (૨-૨-૧)' },
                  { name: 'રગણ (ર)', pattern: 'ગાલગા', desc: 'રાજભા (૨-૧-૨)' },
                  { name: 'જગણ (જ)', pattern: 'લગાલ', desc: 'જભાન (૧-૨-૧)' },
                  { name: 'ભગણ (ભ)', pattern: 'ગાલલ', desc: 'ભાનસ (૨-૧-૧)' },
                  { name: 'નગણ (ન)', pattern: 'લલલ', desc: 'નસલ (૧-૧-૧)' },
                  { name: 'સગણ (સ)', pattern: 'લલગા', desc: 'સલગાં (૧-૧-૨)' },
                ].map((g) => (
                  <div key={g.name} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{g.name}</span>
                      <div className="text-slate-500 text-[11px]">{g.desc}</div>
                    </div>
                    <span className="font-mono font-bold text-sky-800 bg-white px-2 py-1 rounded border border-slate-200">
                      {g.pattern}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
          >
            સમજાઈ ગયું
          </button>
        </div>
      </div>
    </div>
  );
};
