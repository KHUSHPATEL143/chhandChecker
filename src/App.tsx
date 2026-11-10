import React, { useState, useRef, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BAHAR_DATABASE } from './data/baharDatabase';
import { GHAZAL_EXAMPLES, GhazalExample } from './data/examples';
import { BaharDef, LineAnalysis, MeterSettings } from './types/meter';
import { analyzeLine, getTokens } from './utils/pingalEngine';
import { BaharSelector } from './components/BaharSelector';
import { LineAnalysisCard } from './components/LineAnalysisCard';
import { GujaratiHelperBar } from './components/GujaratiHelperBar';
import { PingalGuideModal } from './components/PingalGuideModal';
import { SyllableInspectorModal } from './components/SyllableInspectorModal';
import { AiSettingsModal } from './components/AiSettingsModal';
import { AutoBaharDetectorModal } from './components/AutoBaharDetectorModal';
import { MetricThesaurusModal } from './components/MetricThesaurusModal';
import { SocialCardModal } from './components/SocialCardModal';
import { PoetNotebookModal } from './components/PoetNotebookModal';
import { PoeticTTSManager, TTSState } from './utils/poeticTTS';
import {
  Feather,
  Sparkles,
  BookOpen,
  Settings2,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Sliders,
  HelpCircle,
  Share2,
  Search,
  BookMarked,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Palette,
  FolderOpen,
} from 'lucide-react';

export default function App() {
  // State
  const [selectedBahar, setSelectedBahar] = useState<BaharDef>(BAHAR_DATABASE[0]);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customPattern, setCustomPattern] = useState<string>('લગાગા લગાગા લગાગા લગાગા');

  const [ghazalText, setGhazalText] = useState<string>(
    `નયનને બંધ રાખીને જોયા છે તમને\nમને સ્મિત તારું દીધું તેં છતાં પણ\nગઝલ હું લખું છું તમારી જ યાદે`
  );

  const [settings, setSettings] = useState<MeterSettings>({
    allowLalEqGa: true,
    allowEndLaghuAsGuru: true,
    showSyllableBreakdown: false,
  });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [isAutoDetectorOpen, setIsAutoDetectorOpen] = useState(false);
  const [isThesaurusOpen, setIsThesaurusOpen] = useState(false);
  const [isSocialCardOpen, setIsSocialCardOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [inspectingLine, setInspectingLine] = useState<LineAnalysis | null>(null);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasCheckedManually, setHasCheckedManually] = useState(true);

  // Audio / TTS state
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentLineIndex: -1,
  });

  // Keyboard avoiding & Visual Viewport listener
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.visualViewport) {
        const isKb = window.visualViewport.height < window.innerHeight * 0.78;
        setIsKeyboardOpen(isKb);
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'textarea' || tag === 'input') {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ttsManagerRef = useRef<PoeticTTSManager | null>(null);

  useEffect(() => {
    ttsManagerRef.current = new PoeticTTSManager((state) => {
      setTtsState(state);
    });
    return () => {
      ttsManagerRef.current?.stop();
    };
  }, []);

  // Active target pattern
  const activePattern = useMemo(() => {
    if (isCustomMode) {
      return customPattern.replace(/\s+/g, '');
    }
    return selectedBahar.cleanPattern;
  }, [isCustomMode, customPattern, selectedBahar]);

  // Run analysis line by line
  const analysisResults: LineAnalysis[] = useMemo(() => {
    if (!ghazalText.trim()) return [];
    const rawLines = ghazalText.split('\n');
    return rawLines
      .map((line, idx) => {
        if (!line.trim()) return null;
        return analyzeLine(line, activePattern, settings, idx);
      })
      .filter((res): res is LineAnalysis => res !== null);
  }, [ghazalText, activePattern, settings]);

  const allLinesValid = analysisResults.length > 0 && analysisResults.every((l) => l.isPerfect);
  const hasErrors = analysisResults.some((l) => !l.isPerfect);

  // Trigger celebration confetti when checking perfectly
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // Fallback
    }
  };

  const handleManualCheck = () => {
    setHasCheckedManually(true);
    if (allLinesValid) {
      triggerConfetti();
    }
  };

  // Replace a specific line with AI suggested correction
  const handleApplyCorrection = (lineIndex: number, newText: string) => {
    const lines = ghazalText.split('\n');
    if (lineIndex >= 0 && lineIndex < lines.length) {
      lines[lineIndex] = newText;
      setGhazalText(lines.join('\n'));
      setHasCheckedManually(true);
    }
  };

  // Insert character or word at cursor position in textarea
  const handleInsertChar = (char: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = ghazalText.substring(0, start);
    const after = ghazalText.substring(end);
    const nextText = before + char + after;
    setGhazalText(nextText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 10);
  };

  // Load sample ghazal
  const handleLoadExample = (example: GhazalExample) => {
    const foundBahar = BAHAR_DATABASE.find((b) => b.id === example.baharId);
    if (foundBahar) {
      setSelectedBahar(foundBahar);
      setIsCustomMode(false);
    }
    setGhazalText(example.text);
    setHasCheckedManually(true);
  };

  // Load from Notebook
  const handleLoadFromNotebook = (text: string, baharTitle: string) => {
    setGhazalText(text);
    const found = BAHAR_DATABASE.find((b) => b.title === baharTitle);
    if (found) {
      setSelectedBahar(found);
      setIsCustomMode(false);
    }
    setHasCheckedManually(true);
  };

  // Audio Playback toggles
  const handleTogglePlayAudio = () => {
    if (!ghazalText.trim()) return;
    if (ttsState.isPlaying) {
      if (ttsState.isPaused) {
        ttsManagerRef.current?.resume();
      } else {
        ttsManagerRef.current?.pause();
      }
    } else {
      ttsManagerRef.current?.playGhazal(ghazalText);
    }
  };

  const handleStopAudio = () => {
    ttsManagerRef.current?.stop();
  };

  // Copy report
  const handleCopyReport = () => {
    let report = `📝 ગુજરાતી ગઝલ છંદ વિશ્લેષણ\n`;
    report += `છંદ: ${isCustomMode ? customPattern : selectedBahar.title}\n`;
    report += `------------------------------------\n`;
    analysisResults.forEach((line) => {
      report += `પંક્તિ ${line.lineIndex + 1}: ${line.originalText}\n`;
      report += `માત્રા: ${line.words.map((w) => w.tokens.join('')).join(' ')} (${line.isPerfect ? '✅ છંદબદ્ધ' : '❌ છંદભંગ'})\n\n`;
    });
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-gujarati pb-16 md:pb-0">
      {/* Top Bar following Top Bar Contract */}
      <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs pt-[max(0.75rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Feather className="w-4 h-4" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-gujarati">
            ગુજરાતી ગઝલ છંદ ચેકર
          </span>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600">
          <button
            onClick={() => setIsAutoDetectorOpen(true)}
            className="hover:text-sky-800 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <Search className="w-3.5 h-3.5 text-sky-600" />
            <span>મારો છંદ શોધો</span>
          </button>

          <button
            onClick={() => setIsThesaurusOpen(true)}
            className="hover:text-amber-800 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>કાવ્ય શબ્દકોશ</span>
          </button>

          <button
            onClick={() => setIsNotebookOpen(true)}
            className="hover:text-emerald-800 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
            <span>મારો સંગ્રહ</span>
          </button>

          <button
            onClick={() => setIsSocialCardOpen(true)}
            className="hover:text-purple-800 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600" />
            <span>કાર્ડ બનાવો</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-slate-800 transition-colors"
          >
            પિંગળ નિયમો
          </button>
        </nav>

        {/* Zone 3: Primary Action & AI Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* AI Settings Button */}
          <button
            onClick={() => setIsAiSettingsOpen(true)}
            className="px-2.5 py-1.5 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="OpenRouter AI મોડલ અને સેટિંગ્સ"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI સેટિંગ્સ</span>
          </button>

          {/* Meter Settings Popover Toggle */}
          <button
            onClick={() => setShowSettingsPopover(!showSettingsPopover)}
            className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="છંદ છૂટછાટો અને સેટિંગ્સ"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleManualCheck}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>મીટર ચેક</span>
          </button>
        </div>
      </header>

      {/* Settings Popover Dropdown */}
      {showSettingsPopover && (
        <div className="fixed top-14 right-4 sm:right-6 z-40 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-xs font-gujarati space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-600" />
              પિંગળ છૂટછાટ સેટિંગ્સ
            </span>
            <button
              onClick={() => setShowSettingsPopover(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowLalEqGa}
              onChange={(e) =>
                setSettings({ ...settings, allowLalEqGa: e.target.checked })
              }
              className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
            />
            <div>
              <span className="font-medium text-slate-800">નિયમ ૧: લલ = ગા ની છૂટ</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                બે લઘુ (૧+૧) અક્ષરોને એક ગુરુ (૨) ની જગ્યાએ ગઝલમાં માન્ય રાખવી.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowEndLaghuAsGuru}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  allowEndLaghuAsGuru: e.target.checked,
                })
              }
              className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
            />
            <div>
              <span className="font-medium text-slate-800">
                નિયમ ૨: પંક્તિના અંતે લઘુનો ગુરુ
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ચરણ કે મિસરાના છેલ્લા અક્ષરને કાવ્ય છૂટછાટ મુજબ ગુરુ ગણવો.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Bahar Selector & Presets (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Bahar Selector Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">૧. છંદ પસંદગી:</span>
                <button
                  type="button"
                  onClick={() => setIsAutoDetectorOpen(true)}
                  className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-lg border border-sky-200"
                >
                  <Search className="w-3 h-3" />
                  <span>ઓટો છંદ શોધો</span>
                </button>
              </div>

              <BaharSelector
                selectedBahar={selectedBahar}
                onSelectBahar={(bahar) => setSelectedBahar(bahar)}
                isCustomMode={isCustomMode}
                onToggleCustomMode={(val) => setIsCustomMode(val)}
                customPattern={customPattern}
                onChangeCustomPattern={(pat) => setCustomPattern(pat)}
              />
            </div>

            {/* Quick Toolbox for Mobile & Desktop */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsThesaurusOpen(true)}
                className="p-3 bg-white border border-amber-200 hover:border-amber-400 rounded-xl flex items-center gap-2.5 shadow-2xs hover:bg-amber-50/50 transition text-left"
              >
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">કાવ્ય શબ્દકોશ</div>
                  <div className="text-[10px] text-slate-400">માત્રાવાર શબ્દો</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsNotebookOpen(true)}
                className="p-3 bg-white border border-emerald-200 hover:border-emerald-400 rounded-xl flex items-center gap-2.5 shadow-2xs hover:bg-emerald-50/50 transition text-left"
              >
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">અંગત સંગ્રહ</div>
                  <div className="text-[10px] text-slate-400">ગઝલો સાચવો</div>
                </div>
              </button>
            </div>

            {/* Example Presets Section */}
            <div
              id="examples-section"
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
            >
              <h3 className="text-sm font-semibold text-slate-900 font-gujarati flex items-center justify-between">
                <span>પ્રસિદ્ધ ગઝલોના નમૂના (ટેસ્ટિંગ)</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ક્લિક કરીને લોડ કરો
                </span>
              </h3>

              <div className="space-y-2">
                {GHAZAL_EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadExample(ex)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-medium text-slate-800 group-hover:text-sky-900">
                        {ex.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {ex.poet} · {ex.baharName.split(' ')[0]} {ex.baharName.split(' ')[1]}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        ex.isPerfectSample
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700 font-semibold'
                      }`}
                    >
                      {ex.isPerfectSample ? 'શુદ્ધ' : 'ભંગ ટેસ્ટ ⚠️'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editor & Analysis Results (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Editor Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-semibold text-slate-900 font-gujarati">
                  ૨. તમારી ગઝલ લખો અથવા પેસ્ટ કરો
                </label>

                {/* Audio Recitation Bar */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className="flex items-center gap-1 text-slate-700 hover:text-sky-700 font-semibold"
                    title={ttsState.isPlaying && !ttsState.isPaused ? 'રોકો' : 'ગઝલ પઠન સાંભળો'}
                  >
                    {ttsState.isPlaying && !ttsState.isPaused ? (
                      <Pause className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>{ttsState.isPlaying && !ttsState.isPaused ? 'વિરામ' : 'પઠન સાંભળો'}</span>
                  </button>

                  {ttsState.isPlaying && (
                    <button
                      type="button"
                      onClick={handleStopAudio}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="બંધ કરો"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGhazalText('')}
                    className="text-xs text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 font-gujarati"
                    title="ખાલી કરો"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>સાફ કરો</span>
                  </button>
                </div>
              </div>

              {/* Gujarati Character Helper Bar */}
              <GujaratiHelperBar onInsertChar={handleInsertChar} />

              {/* Text Area */}
              <textarea onFocus={(e) => { setTimeout(() => { e.target.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300); }}
                ref={textareaRef}
                value={ghazalText}
                onChange={(e) => setGhazalText(e.target.value)}
                placeholder="તમારી ગઝલની પંક્તિઓ અહીં પેસ્ટ કરો (દરેક પંક્તિ નવી લાઈનમાં)..."
                rows={5}
                className="w-full p-3.5 bg-slate-50/50 border border-slate-300 rounded-xl text-lg font-gujarati-serif leading-relaxed text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-600 placeholder:text-slate-400 font-medium"
              />

              {/* Action and Stats Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-600 font-gujarati">
                <div className="flex items-center gap-3 flex-wrap">
                  <span>
                    કુલ પંક્તિઓ: <b>{analysisResults.length}</b>
                  </span>
                  <span>·</span>
                  <span>
                    પસંદ કરેલ છંદ: <b className="text-sky-900 font-mono">{isCustomMode ? customPattern : selectedBahar.pattern}</b>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSocialCardOpen(true)}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Share2 className="w-3 h-3 text-purple-600" />
                    <span>સોશિયલ કાર્ડ</span>
                  </button>

                  <button
                    onClick={handleManualCheck}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>મીટર ચેક કરો 🔍</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Results Display */}
            {analysisResults.length > 0 && (
              <div className="space-y-4">
                {/* Result Header & Status Banner */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-base font-semibold text-slate-900 font-gujarati">
                    પરીક્ષણ પરિણામ (લાઈન બાય લાઈન વિશ્લેષણ):
                  </h3>

                  <button
                    onClick={handleCopyReport}
                    className="text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs font-gujarati"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'કોપી થઈ ગયું!' : 'પરિણામ કોપી કરો'}</span>
                  </button>
                </div>

                {/* Overall Verdict Banner */}
                {allLinesValid ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <h4 className="font-bold text-sm">
                          ખૂબ સરસ! તમારી આખી ગઝલ પસંદ કરેલા છંદમાં બિલકુલ યોગ્ય છે.
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          બધા મિસરા માત્રા અને વજન સાથે સંપૂર્ણ મેળ ખાય છે.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsSocialCardOpen(true)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>કાર્ડ બનાવો</span>
                      </button>
                    </div>
                  </div>
                ) : hasErrors ? (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-bold text-sm">
                        છંદભંગ જણાય છે: લાલ રંગથી દર્શાવેલી પંક્તિઓમાં માત્રા મેળ ખાતી નથી.
                      </h4>
                      <p className="text-xs text-rose-800 mt-0.5">
                        તમે પંક્તિ પર આપેલ <strong>"AI છંદ સુધારો અને વિકલ્પો"</strong> બટન દબાવીને મૂળ ભાવ જાળવી રાખતી છંદબદ્ધ પંક્તિઓ અને વૈકલ્પિક શબ્દો મેળવી શકો છો.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Cards for each Ghazal line */}
                <div className="space-y-3">
                  {analysisResults.map((line, idx) => (
                    <div
                      key={idx}
                      className={ttsState.currentLineIndex === idx ? 'ring-2 ring-sky-500 rounded-xl' : ''}
                    >
                      <LineAnalysisCard
                        line={line}
                        targetPattern={activePattern}
                        targetTitle={isCustomMode ? customPattern : selectedBahar.title}
                        fullGhazalContext={ghazalText}
                        settings={settings}
                        onInspectLine={(l) => setInspectingLine(l)}
                        onApplyCorrection={handleApplyCorrection}
                        onOpenAiSettings={() => setIsAiSettingsOpen(true)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Syllable Inspector Modal */}
      <SyllableInspectorModal
        line={inspectingLine}
        onClose={() => setInspectingLine(null)}
      />

      {/* Pingal Guide Modal */}
      <PingalGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectBahar={(id) => {
          const found = BAHAR_DATABASE.find((b) => b.id === id);
          if (found) {
            setSelectedBahar(found);
            setIsCustomMode(false);
          }
        }}
      />

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
      />

      {/* Feature 2: Auto Bahar Detector Modal */}
      <AutoBaharDetectorModal
        isOpen={isAutoDetectorOpen}
        onClose={() => setIsAutoDetectorOpen(false)}
        ghazalText={ghazalText}
        settings={settings}
        onSelectBahar={(bahar) => {
          setSelectedBahar(bahar);
          setIsCustomMode(false);
        }}
      />

      {/* Feature 4: Metric Thesaurus Modal */}
      <MetricThesaurusModal
        isOpen={isThesaurusOpen}
        onClose={() => setIsThesaurusOpen(false)}
        onSelectWord={(word) => handleInsertChar(` ${word} `)}
      />

      {/* Feature 6: Social Card Modal */}
      <SocialCardModal
        isOpen={isSocialCardOpen}
        onClose={() => setIsSocialCardOpen(false)}
        ghazalText={ghazalText}
        baharTitle={isCustomMode ? customPattern : selectedBahar.title}
      />

      {/* Feature 7: Poet's Notebook Modal */}
      <PoetNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        currentText={ghazalText}
        currentBaharTitle={isCustomMode ? customPattern : selectedBahar.title}
        currentBaharPattern={activePattern}
        isCurrentPerfect={allLinesValid}
        onLoadGhazal={handleLoadFromNotebook}
      />

      {/* Mobile Bottom Navigation Bar (APK & Touch Optimized) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-600 shadow-lg pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-in-out ${isKeyboardOpen ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
        <button
          onClick={() => {
            textareaRef.current?.scrollIntoView({ behavior: 'smooth' });
            textareaRef.current?.focus();
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg hover:text-sky-700 active:scale-90 transition font-medium"
        >
          <Feather className="w-4 h-4 text-sky-700" />
          <span>એડિટર</span>
        </button>

        <button
          onClick={() => setIsAutoDetectorOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg hover:text-sky-700 active:scale-90 transition font-medium"
        >
          <Search className="w-4 h-4 text-sky-600" />
          <span>છંદ શોધો</span>
        </button>

        <button
          onClick={() => setIsThesaurusOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg hover:text-amber-700 active:scale-90 transition font-medium"
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>શબ્દકોશ</span>
        </button>

        <button
          onClick={handleTogglePlayAudio}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg hover:text-emerald-700 active:scale-90 transition font-medium"
        >
          {ttsState.isPlaying && !ttsState.isPaused ? (
            <Pause className="w-4 h-4 text-amber-600" />
          ) : (
            <Play className="w-4 h-4 text-emerald-600" />
          )}
          <span>{ttsState.isPlaying && !ttsState.isPaused ? 'વિરામ' : 'પઠન'}</span>
        </button>

        <button
          onClick={() => setIsNotebookOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg hover:text-emerald-700 active:scale-90 transition font-medium"
        >
          <BookMarked className="w-4 h-4 text-emerald-600" />
          <span>સંગ્રહ</span>
        </button>

        <button
          onClick={() => setIsSocialCardOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg hover:text-purple-700 active:scale-90 transition font-medium"
        >
          <Share2 className="w-4 h-4 text-purple-600" />
          <span>કાર્ડ</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 font-gujarati">
        <p>
          ગુજરાતી ગઝલ છંદ (મીટર) ચેકર · ઉદય શાહના ૩૦ છંદોના ડેટાબેઝ અને પિંગળશાસ્ત્ર આધારિત · OpenRouter AI સુધારક સાથે સુસજ્જ
        </p>
      </footer>
    </div>
  );
}