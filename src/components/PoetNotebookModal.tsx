import React, { useState, useEffect } from 'react';
import {
  X,
  BookMarked,
  Save,
  Trash2,
  FolderOpen,
  Download,
  Copy,
  Check,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  SavedGhazal,
  getSavedGhazals,
  saveGhazalToNotebook,
  deleteGhazalFromNotebook,
  exportNotebookAsText,
} from '../utils/notebookStorage';

interface PoetNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  currentBaharTitle: string;
  currentBaharPattern: string;
  isCurrentPerfect: boolean;
  onLoadGhazal: (text: string, baharTitle: string) => void;
}

export const PoetNotebookModal: React.FC<PoetNotebookModalProps> = ({
  isOpen,
  onClose,
  currentText,
  currentBaharTitle,
  currentBaharPattern,
  isCurrentPerfect,
  onLoadGhazal,
}) => {
  const [savedList, setSavedList] = useState<SavedGhazal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('બધા');

  // Save new dialog state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SavedGhazal['category']>('શ્રૃંગાર');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSavedList(getSavedGhazals());
      // Default title from first line
      const firstLine = currentText.split('\n').map((l) => l.trim()).find(Boolean) || 'મારી નવી ગઝલ';
      setNewTitle(firstLine);
    }
  }, [isOpen, currentText]);

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    if (!currentText.trim()) return;

    saveGhazalToNotebook({
      title: newTitle.trim() || 'મારી ગઝલ',
      text: currentText,
      baharTitle: currentBaharTitle,
      baharPattern: currentBaharPattern,
      category: newCategory,
      isPerfect: isCurrentPerfect,
    });

    setSavedList(getSavedGhazals());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    deleteGhazalFromNotebook(id);
    setSavedList(getSavedGhazals());
  };

  const handleExportText = () => {
    const text = exportNotebookAsText();
    navigator.clipboard.writeText(text);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const categories = ['બધા', 'શ્રૃંગાર', 'દર્શન', 'સૂફી', 'કરુણ', 'અન્ય'];

  const filteredList = savedList.filter((g) => {
    const matchesCat = selectedCategory === 'બધા' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex max-md:items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs font-gujarati animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">અંગત ગઝલ સંગ્રહ (Poet's Notebook)</h3>
              <p className="text-xs text-slate-500">
                તમારી રચનાઓ બ્રાઉઝરમાં સુરક્ષિત સાચવો અને ગમે ત્યારે ખોલો (૧૦૦% ઓફલાઇન)
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

        {/* Quick Save Current Bar */}
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="ગઝલનું શીર્ષક..."
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold flex-1 focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
            >
              <option value="શ્રૃંગાર">શ્રૃંગાર</option>
              <option value="દર્શન">દર્શન</option>
              <option value="સૂફી">સૂફી</option>
              <option value="કરુણ">કરુણ</option>
              <option value="અન્ય">અન્ય</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSaveCurrent}
            disabled={!currentText.trim()}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 shrink-0"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>સાચવી લીધી!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>હાલની રચના સાચવો</span>
              </>
            )}
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="સંગ્રહમાં શોધો..."
              className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2 py-1 rounded-md text-[11px] transition ${
                  selectedCategory === c
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Ghazals List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              હજી સુધી કોઈ ગઝલ સાચવેલી નથી. ઉપર આપેલ "હાલની રચના સાચવો" બટન દબાવો.
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl shadow-2xs hover:shadow-xs transition space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm font-gujarati group-hover:text-emerald-900">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                        #{item.category}
                      </span>
                      {item.isPerfect ? (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>છંદબદ્ધ</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                          <span>ડ્રાફ્ટ</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 font-gujarati-serif leading-relaxed">
                      {item.text}
                    </p>

                    <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                      છંદ: {item.baharTitle} · {new Date(item.updatedAt).toLocaleDateString('gu-IN')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadGhazal(item.text, item.baharTitle);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                      title="એડિટરમાં ખોલો"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>ખોલો</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="કાઢી નાખો"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <button
            type="button"
            onClick={handleExportText}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold"
          >
            {copiedExport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>સંગ્રહ કોપી થઈ ગયો!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>સમગ્ર સંગ્રહ એક્સપોર્ટ / કોપી કરો</span>
              </>
            )}
          </button>

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