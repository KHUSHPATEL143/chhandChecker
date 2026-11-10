export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentLineIndex: number;
}

export class PoeticTTSManager {
  private synth: SpeechSynthesis | null = null;
  private lines: string[] = [];
  private currentIdx = 0;
  private isStopped = false;
  private onStateChange: (state: TTSState) => void;
  private rate = 0.82; // Poetic cadence

  constructor(onStateChange: (state: TTSState) => void) {
    this.onStateChange = onStateChange;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setRate(newRate: number) {
    this.rate = newRate;
  }

  public playGhazal(text: string, startLineIndex = 0) {
    if (!this.synth) return;

    this.stop();
    this.isStopped = false;

    this.lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (this.lines.length === 0) return;

    this.currentIdx = Math.min(startLineIndex, this.lines.length - 1);
    this.speakCurrentLine();
  }

  private speakCurrentLine() {
    if (this.isStopped || !this.synth || this.currentIdx >= this.lines.length) {
      this.stop();
      return;
    }

    this.onStateChange({
      isPlaying: true,
      isPaused: false,
      currentLineIndex: this.currentIdx,
    });

    const lineText = this.lines[this.currentIdx];
    const utterance = new SpeechSynthesisUtterance(lineText);
    utterance.rate = this.rate;
    utterance.pitch = 0.95;

    // Pick best Indic/Gujarati voice
    const voices = this.synth.getVoices();
    const guVoice = voices.find((v) => v.lang.startsWith('gu'));
    const hiVoice = voices.find((v) => v.lang.startsWith('hi'));

    if (guVoice) {
      utterance.voice = guVoice;
    } else if (hiVoice) {
      utterance.voice = hiVoice;
    }

    utterance.onend = () => {
      if (this.isStopped) return;
      this.currentIdx++;
      if (this.currentIdx < this.lines.length) {
        // Poetic pause between lines (1.0 second)
        setTimeout(() => {
          this.speakCurrentLine();
        }, 900);
      } else {
        this.stop();
      }
    };

    utterance.onerror = () => {
      this.stop();
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth) {
      this.synth.pause();
      this.onStateChange({
        isPlaying: true,
        isPaused: true,
        currentLineIndex: this.currentIdx,
      });
    }
  }

  public resume() {
    if (this.synth) {
      this.synth.resume();
      this.onStateChange({
        isPlaying: true,
        isPaused: false,
        currentLineIndex: this.currentIdx,
      });
    }
  }

  public stop() {
    this.isStopped = true;
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentIdx = 0;
    this.onStateChange({
      isPlaying: false,
      isPaused: false,
      currentLineIndex: -1,
    });
  }
}