import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  Palette,
  Feather,
  MessageSquareQuote,
} from 'lucide-react';

interface SocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  ghazalText: string;
  baharTitle: string;
}

type ThemeKey = 'royal_navy' | 'vintage_parchment' | 'dark_velvet' | 'sunset_crimson';

interface ThemeConfig {
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  subtextColor: string;
  borderColor: string;
  gradientBg: string;
}

const THEMES: Record<ThemeKey, ThemeConfig> = {
  royal_navy: {
    name: 'રોયલ શાહી (Navy & Gold)',
    bgColor: '#0f172a',
    textColor: '#f8fafc',
    accentColor: '#fbbf24',
    subtextColor: '#94a3b8',
    borderColor: '#334155',
    gradientBg: 'from-slate-900 via-indigo-950 to-slate-900',
  },
  vintage_parchment: {
    name: 'પ્રાચીન ભોજપત્ર (Parchment)',
    bgColor: '#faf6ee',
    textColor: '#292524',
    accentColor: '#b45309',
    subtextColor: '#78716c',
    borderColor: '#e7e0d3',
    gradientBg: 'from-amber-50 via-stone-100 to-orange-50',
  },
  dark_velvet: {
    name: 'સૂફી મખમલ (Dark Velvet)',
    bgColor: '#18181b',
    textColor: '#ffffff',
    accentColor: '#38bdf8',
    subtextColor: '#a1a1aa',
    borderColor: '#27272a',
    gradientBg: 'from-zinc-950 via-neutral-900 to-zinc-950',
  },
  sunset_crimson: {
    name: 'સંધ્યા લાલ (Sunset Rose)',
    bgColor: '#4c0519',
    textColor: '#fff1f2',
    accentColor: '#f43f5e',
    subtextColor: '#fecdd3',
    borderColor: '#881337',
    gradientBg: 'from-rose-950 via-pink-950 to-slate-950',
  },
};

export const SocialCardModal: React.FC<SocialCardModalProps> = ({
  isOpen,
  onClose,
  ghazalText,
  baharTitle,
}) => {
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('royal_navy');
  const [poetName, setPoetName] = useState('ગુજરાતી શાયર');
  const [showWatermark, setShowWatermark] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lines = ghazalText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // ChatGPT DALL-E image generation prompt generator
  const generatedChatGptPrompt = `Create an ethereal, hyper-realistic poetry background illustration for a Gujarati Ghazal. 
Theme: Soulful longing, romantic nostalgia, and reflective twilight ambiance. 
Visual elements: Subtle gold-leaf ornamental borders inspired by vintage Gujarati manuscript motifs, soft moody candlelight and starry night sky, rich textured antique parchment paper in the center with vast negative space for typography.
Mood: Poetic, tranquil, serene, elegant, timeless. 
Cinematic lighting, high detail, 4k wallpaper style, vertical portrait aspect ratio 4:5, no text in the image.`;

  if (!isOpen) return null;

  const currentTheme = THEMES[activeTheme];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedChatGptPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Pure HTML5 Canvas exporter for downloading image (100% native, APK-ready)
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set resolution (1080 x 1350 Instagram 4:5 ratio)
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    const theme = THEMES[activeTheme];

    // Background fill
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, width, height);

    // Decorative outer border
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Inner thin border
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Header ornament
    ctx.fillStyle = theme.accentColor;
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ───── ❖ ───── ✦', width / 2, 130);

    // Bahar Title
    ctx.fillStyle = theme.subtextColor;
    ctx.font = '32px sans-serif';
    ctx.fillText(baharTitle, width / 2, 180);

    // Ghazal Lines
    ctx.fillStyle = theme.textColor;
    ctx.font = '600 42px "Noto Serif Gujarati", serif';

    const displayLines = lines.slice(0, 8);
    const startY = 320;
    const lineHeight = 80;

    displayLines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight);
    });

    // Divider
    const dividerY = startY + displayLines.length * lineHeight + 40;
    ctx.fillStyle = theme.accentColor;
    ctx.fillText('• • •', width / 2, dividerY);

    // Poet Name / Takhallus
    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 36px "Anek Gujarati", sans-serif';
    ctx.fillText(`— ${poetName}`, width / 2, dividerY + 70);

    // Footer Watermark
    if (showWatermark) {
      ctx.fillStyle = theme.subtextColor;
      ctx.font = '24px sans-serif';
      ctx.fillText('ગુજરાતી ગઝલ છંદ ચેકર · પિંગળ પ્રમાણિત', width / 2, height - 90);
    }

    // Trigger download
    const link = document.createElement('a');
    link.download = `ghazal-card-${poetName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex max-md:items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs font-gujarati animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">સોશિયલ મીડિયા કાવ્ય કાર્ડ એક્સપોર્ટર</h3>
              <p className="text-xs text-slate-500">
                ઇન્સ્ટાગ્રામ અને વ્હોટ્સએપ માટે સુંદર ગઝલ કાર્ડ અને ChatGPT ઈમેજ પ્રોમ્પ્ટ
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

        {/* Body grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Visual Card Preview (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            {/* Visual Card Canvas Box */}
            <div
              ref={cardRef}
              className={`w-full max-w-md aspect-[4/5] rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-center shadow-xl border relative transition-all duration-300 bg-gradient-to-b ${currentTheme.gradientBg}`}
              style={{
                borderColor: currentTheme.borderColor,
                color: currentTheme.textColor,
              }}
            >
              {/* Decorative Corner Borders */}
              <div
                className="absolute inset-3 border rounded-xl pointer-events-none opacity-40"
                style={{ borderColor: currentTheme.accentColor }}
              />

              {/* Header */}
              <div className="space-y-1 relative z-10">
                <span
                  className="text-xs tracking-widest uppercase opacity-75"
                  style={{ color: currentTheme.accentColor }}
                >
                  ✦ ───── ❖ ───── ✦
                </span>
                <p
                  className="text-[11px] font-mono tracking-wide"
                  style={{ color: currentTheme.subtextColor }}
                >
                  {baharTitle}
                </p>
              </div>

              {/* Ghazal Text in Serif Font */}
              <div className="space-y-3 my-auto py-4 relative z-10">
                {lines.slice(0, 6).map((line, idx) => (
                  <p
                    key={idx}
                    className="font-gujarati-serif text-base sm:text-lg leading-relaxed font-semibold tracking-wide"
                  >
                    {line}
                  </p>
                ))}
                {lines.length > 6 && (
                  <p
                    className="text-xs italic opacity-60"
                    style={{ color: currentTheme.subtextColor }}
                  >
                    (+ વધુ {lines.length - 6} પંક્તિઓ)
                  </p>
                )}
              </div>

              {/* Poet and Footer */}
              <div className="space-y-2 relative z-10 pt-2 border-t border-white/10">
                <div
                  className="font-bold text-sm tracking-wide"
                  style={{ color: currentTheme.accentColor }}
                >
                  — {poetName}
                </div>
                {showWatermark && (
                  <div
                    className="text-[10px] tracking-wider opacity-60"
                    style={{ color: currentTheme.subtextColor }}
                  >
                    ગુજરાતી ગઝલ છંદ ચેકર · પિંગળ પ્રમાણિત
                  </div>
                )}
              </div>
            </div>

            {/* Hidden canvas for native high-res export */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Right Column: Customization & ChatGPT Prompt (5 cols) */}
          <div className="md:col-span-5 space-y-5 text-xs">
            {/* Theme picker */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-600" />
                <span>કાર્ડ થીમ પસંદ કરો:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveTheme(k)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      activeTheme === k
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-1 ring-purple-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs truncate">{THEMES[k].name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Poet Name Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-purple-600" />
                <span>તમારું નામ / તખલ્લુસ (Pen Name):</span>
              </label>
              <input
                type="text"
                value={poetName}
                onChange={(e) => setPoetName(e.target.value)}
                placeholder="દા.ત. ખુશ / બેફામ"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>

            {/* Watermark toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>પિંગળ પ્રમાણિત વૉટરમાર્ક દર્શાવો</span>
            </label>

            {/* Native Download Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition active:scale-95 text-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'કાર્ડ બની રહ્યું છે...' : 'HD ઈમેજ ડાઉનલોડ કરો (PNG)'}</span>
            </button>

            {/* ChatGPT Prompt Generation Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>ChatGPT / DALL-E પ્રોમ્પ્ટ:</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center gap-1 transition"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>કોપી થઈ ગયું!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>પ્રોમ્પ્ટ કોપી કરો</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                આ પ્રોમ્પ્ટને ChatGPT અથવા Midjourney માં પેસ્ટ કરીને આ ગઝલ માટે અદભુત આર્ટ બેકગ્રાઉન્ડ જનરેટ કરી શકો છો:
              </p>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[10px] text-slate-700 leading-relaxed max-h-24 overflow-y-auto select-all">
                {generatedChatGptPrompt}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>મોબાઇલ અને APK-તૈયાર હાઇ-રિઝોલ્યુશન એક્સપોર્ટ</span>
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