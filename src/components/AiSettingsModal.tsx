import React, { useState } from 'react';
import {
  X,
  Key,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  AVAILABLE_MODELS,
  getOpenRouterApiKey,
  setOpenRouterApiKey,
  getPreferredModel,
  setPreferredModel,
} from '../services/openRouterService';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getOpenRouterApiKey());
  const [selectedModel, setSelectedModel] = useState(getPreferredModel());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setOpenRouterApiKey(apiKey);
    setPreferredModel(selectedModel);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestMessage('કૃપા કરીને પહેલા API Key દાખલ કરો.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('OpenRouter સાથે જોડાણ તપાસાઈ રહ્યું છે...');

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': window.location.origin,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: 'Say OK in Gujarati' }],
          max_tokens: 15,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      const data = await res.json();
      setTestStatus('success');
      setTestMessage(`જોડાણ સફળ રહ્યું! મોડલ: ${selectedModel}`);
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`જોડાણ નિષ્ફળ: ${err.message || 'અજ્ઞાત ક્ષતિ'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex max-md:items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs font-gujarati animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">AI છંદ સહાયક સેટિંગ્સ</h3>
              <p className="text-xs text-slate-500">OpenRouter API અને AI મોડલ રૂપરેખાંકન</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between font-semibold text-slate-700 text-xs">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-sky-600" />
                <span>OpenRouter API Key:</span>
              </span>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <span>API Key મેળવો</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-500">
              આ કી તમારા બ્રાઉઝરમાં સુરક્ષિત રીતે સંગ્રહિત થાય છે અથવા પ્રોજેક્ટની <code className="text-slate-700">.env</code> ફાઈલમાંથી આવે છે.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
              <Cpu className="w-3.5 h-3.5 text-sky-600" />
              <span>AI મોડલ પસંદ કરો:</span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              મફત (Free) મોડલ્સ માટે કોઈ ક્રેડિટની જરૂર નથી અને તે ખૂબ ઝડપી છે.
            </p>
          </div>

          {/* Test connection section */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition font-medium disabled:opacity-50"
            >
              {testStatus === 'testing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>ચકાસણી ચાલુ...</span>
                </>
              ) : (
                <span>API જોડાણ ચકાસો</span>
              )}
            </button>

            {testStatus === 'success' && (
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>જોડાણ સફળ!</span>
              </span>
            )}

            {testStatus === 'error' && (
              <span className="text-xs text-rose-600 flex items-center gap-1 font-medium max-w-[220px] truncate" title={testMessage}>
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{testMessage}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition"
          >
            રદ કરો
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>સેવ થઈ ગયું!</span>
              </>
            ) : (
              <span>સેટિંગ્સ સેવ કરો</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};