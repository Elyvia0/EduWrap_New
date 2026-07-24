import { motion } from 'framer-motion';
import { Play, Coffee, Music } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Toast } from '../../components/ui/Toast';

const PRESETS = [15, 25, 45, 60];
const BREAK_SECONDS = 5 * 60;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function createBrownNoiseLoop() {
  const ctx = new AudioContext();
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowPass = ctx.createBiquadFilter();
  lowPass.type = 'lowpass';
  lowPass.frequency.value = 500;

  const gain = ctx.createGain();
  gain.gain.value = 0.06;

  source.connect(lowPass);
  lowPass.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  return { ctx, source, gain, lowPass };
}

export default function FocusWidget() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'focus' | 'break'
  const [isRunning, setIsRunning] = useState(false);
  const [savedFocusSeconds, setSavedFocusSeconds] = useState(null);
  const [soundOn, setSoundOn] = useState(false);
  const [toast, setToast] = useState(null);

  const phaseRef = useRef(phase);
  const savedFocusRef = useRef(savedFocusSeconds);
  const selectedMinutesRef = useRef(selectedMinutes);
  const audioNodesRef = useRef(null);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { savedFocusRef.current = savedFocusSeconds; }, [savedFocusSeconds]);
  useEffect(() => { selectedMinutesRef.current = selectedMinutes; }, [selectedMinutes]);

  const stopAmbientSound = useCallback(() => {
    if (!audioNodesRef.current) return;
    const { ctx, source, gain, lowPass } = audioNodesRef.current;
    try { source.stop(); } catch { /* already stopped */ }
    try { source.disconnect(); } catch { /* noop */ }
    try { lowPass.disconnect(); } catch { /* noop */ }
    try { gain.disconnect(); } catch { /* noop */ }
    try { ctx.close(); } catch { /* noop */ }
    audioNodesRef.current = null;
  }, []);

  const startAmbientSound = useCallback(() => {
    if (audioNodesRef.current) return;
    audioNodesRef.current = createBrownNoiseLoop();
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev > 1) return prev - 1;

        const currentPhase = phaseRef.current;

        if (currentPhase === 'focus') {
          stopAmbientSound();
          setSoundOn(false);
          setIsRunning(false);
          setPhase('idle');
          setToast({ type: 'success', message: 'Focus session complete!' });
          return selectedMinutesRef.current * 60;
        }

        if (currentPhase === 'break') {
          stopAmbientSound();
          setSoundOn(false);
          const restored = savedFocusRef.current ?? selectedMinutesRef.current * 60;
          setSavedFocusSeconds(null);
          savedFocusRef.current = null;
          setPhase('focus');
          phaseRef.current = 'focus';
          setToast({ type: 'info', message: "Break's over — back to focus!" });
          return restored;
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, stopAmbientSound]);

  useEffect(() => () => stopAmbientSound(), [stopAmbientSound]);

  const handlePlayPause = () => {
    if (phase === 'idle') {
      const seconds = selectedMinutes * 60;
      setRemainingSeconds(seconds);
      setPhase('focus');
      phaseRef.current = 'focus';
      setIsRunning(true);
      return;
    }

    if (isRunning) {
      stopAmbientSound();
      setSoundOn(false);
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const handleCoffee = () => {
    if (phase === 'idle') return;

    if (phase === 'break') {
      stopAmbientSound();
      setSoundOn(false);
      const restored = savedFocusSeconds ?? selectedMinutes * 60;
      setSavedFocusSeconds(null);
      savedFocusRef.current = null;
      setPhase('focus');
      phaseRef.current = 'focus';
      setRemainingSeconds(restored);
      setIsRunning(true);
      return;
    }

    stopAmbientSound();
    setSoundOn(false);
    setSavedFocusSeconds(remainingSeconds);
    savedFocusRef.current = remainingSeconds;
    setPhase('break');
    phaseRef.current = 'break';
    setRemainingSeconds(BREAK_SECONDS);
    setIsRunning(true);
  };

  const handleMusicToggle = () => {
    if (phase !== 'focus' || !isRunning) return;

    if (soundOn) {
      stopAmbientSound();
      setSoundOn(false);
    } else {
      startAmbientSound();
      setSoundOn(true);
    }
  };

  const selectPreset = (minutes) => {
    if (phase !== 'idle' || isRunning) return;
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
  };

  const sessionActive = phase !== 'idle';
  const presetsVisible = phase === 'idle' && !isRunning;
  const coffeeEnabled = sessionActive;
  const musicEnabled = phase === 'focus' && isRunning;

  const statusLabel =
    phase === 'break' ? 'On Break' : sessionActive ? 'Focusing' : 'Focus Mode';

  return (
    <>
      <motion.div
        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
        className="bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] rounded-3xl p-1 shadow-(--shadow-glow) shrink-0 self-start"
      >
        <div className="bg-(--bg-elevated) rounded-[22px] px-4 py-3 flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
              isRunning
                ? 'bg-red-500 text-white'
                : 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))]'
            }`}
            aria-label={isRunning ? 'Pause focus timer' : 'Start focus timer'}
          >
            {isRunning ? (
              <div className="w-3 h-3 rounded-sm bg-white" />
            ) : (
              <Play size={18} className="ml-1" fill="currentColor" />
            )}
          </button>

          <div className="flex flex-col min-w-[100px] flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              {statusLabel}
            </span>

            {presetsVisible && (
              <div className="flex gap-1 mt-1 mb-1">
                {PRESETS.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => selectPreset(minutes)}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                      selectedMinutes === minutes
                        ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))]'
                        : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-glass)'
                    }`}
                  >
                    {minutes}
                  </button>
                ))}
              </div>
            )}

            <span className="text-lg font-bold font-mono text-(--text-primary)">
              {formatTime(remainingSeconds)}
            </span>
          </div>

          <div className="w-px h-8 bg-(--border-default) mx-1 shrink-0" />

          <button
            type="button"
            onClick={handleCoffee}
            disabled={!coffeeEnabled}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              coffeeEnabled
                ? 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-glass)'
                : 'text-(--text-muted)/40 cursor-not-allowed'
            }`}
            aria-label={phase === 'break' ? 'End break early' : 'Take a 5-minute break'}
          >
            <Coffee size={16} />
          </button>

          <button
            type="button"
            onClick={handleMusicToggle}
            disabled={!musicEnabled}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              musicEnabled
                ? soundOn
                  ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)]'
                  : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-glass)'
                : 'text-(--text-muted)/40 cursor-not-allowed'
            }`}
            aria-label={soundOn ? 'Stop ambient focus sound' : 'Play ambient focus sound'}
          >
            <Music size={16} fill={soundOn ? 'currentColor' : 'none'} />
          </button>
        </div>
      </motion.div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
