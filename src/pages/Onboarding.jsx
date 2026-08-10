import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Check, User, Sparkles, Code, Calculator, Book, Beaker, Globe, Palette } from 'lucide-react';

const SUBJECTS = [
  { id: 'math', label: 'Mathematics', icon: Calculator },
  { id: 'physics', label: 'Physics', icon: Beaker },
  { id: 'cs', label: 'Computer Science', icon: Code },
  { id: 'literature', label: 'Literature', icon: Book },
  { id: 'languages', label: 'Languages', icon: Globe },
  { id: 'design', label: 'Design', icon: Palette },
];

const PREFERENCES = [
  { id: 'night', label: 'Night Owl', desc: 'I study best late at night' },
  { id: 'early', label: 'Early Bird', desc: 'Mornings are my peak hours' },
  { id: 'solo', label: 'Solo Learner', desc: 'I prefer studying alone' },
  { id: 'group', label: 'Collaborator', desc: 'Group sessions are best' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const draftSignup = (() => {
    try {
      return JSON.parse(localStorage.getItem('ew_draft_signup') || '{}');
    } catch {
      return {};
    }
  })();

  const userEmail = location.state?.email || draftSignup.email || 'user@example.com';

  // Form State
  const [name, setName] = useState(() => location.state?.name || draftSignup.name || '');
  const [avatarIndex, setAvatarIndex] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedPrefs, setSelectedPrefs] = useState([]);

  const nextStep = () => {
    setDirection(1);
    setStep(s => s + 1);
  };
  
  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const toggleSubject = (id) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const togglePref = (id) => {
    setSelectedPrefs(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#3b82f6', '#10b981']
    });

    // Save onboarding data to Firestore
    try {
      await updateUser({
        name: name || draftSignup.name || 'Student',
        college: location.state?.college || draftSignup.college || '',
        studyType: location.state?.studyType || draftSignup.studyType || '',
        branch: location.state?.branch || draftSignup.branch || '',
        yearOfStudy: location.state?.yearOfStudy || draftSignup.yearOfStudy || '',
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${avatarIndex}`,
        subjects: selectedSubjects,
        studyPreferences: selectedPrefs,
        onboardingCompleted: true,
        xp: 100, // Welcome bonus
        streak: 1,
      });
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
    }

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="bg-(--bg-glass) backdrop-blur-2xl border border-(--border-strong) rounded-3xl p-8 shadow-(--shadow-xl) w-full max-w-md mx-auto relative overflow-hidden min-h-[480px] flex flex-col">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-(--bg-elevated)">
        <motion.div 
          className="h-full bg-[color:oklch(0.58_0.22_var(--accent-hue))]"
          initial={{ width: '25%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 relative mt-4">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-2">Let's set up your profile</h2>
              <p className="text-(--text-secondary) text-sm mb-6">How should we address you in the workspace?</p>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer mb-4" onClick={() => setAvatarIndex(i => i + 1)}>
                  <div className="w-24 h-24 rounded-full bg-(--bg-elevated) border-4 border-(--border-subtle) overflow-hidden shadow-lg transition-transform group-hover:scale-105 group-hover:border-[color:oklch(0.58_0.22_var(--accent-hue))]">
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarIndex}&backgroundColor=transparent`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 right-0 bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white p-1.5 rounded-full shadow-lg">
                    <Sparkles size={14} />
                  </div>
                </div>
                <button 
                  onClick={() => setAvatarIndex(i => i + 1)}
                  className="text-xs text-(--text-muted) hover:text-(--text-primary) transition-colors font-medium"
                >
                  Generate new avatar
                </button>
              </div>

              <div className="mt-auto mb-8">
                <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">Your Name</label>
                <Input 
                  icon={User} 
                  type="text" 
                  placeholder="e.g. Alex Chen" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mt-auto">
                <Button onClick={nextStep} disabled={!name.trim()} className="w-full">
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-2">What are you studying?</h2>
              <p className="text-(--text-secondary) text-sm mb-6">Select topics to personalize your dashboard and recommendations.</p>
              
              <div className="flex flex-wrap gap-2.5 mb-8">
                {SUBJECTS.map(subject => {
                  const Icon = subject.icon;
                  const isSelected = selectedSubjects.includes(subject.id);
                  return (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        isSelected 
                          ? 'border-[color:oklch(0.58_0.22_var(--accent-hue))] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))] shadow-(--shadow-glow)' 
                          : 'border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong) text-(--text-secondary)'
                      }`}
                    >
                      <Icon size={16} />
                      {subject.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex gap-3">
                <Button variant="secondary" onClick={prevStep} className="px-6">Back</Button>
                <Button onClick={nextStep} className="flex-1" disabled={selectedSubjects.length === 0}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-2">Study Preferences</h2>
              <p className="text-(--text-secondary) text-sm mb-6">How do you prefer to get things done?</p>
              
              <div className="grid grid-cols-1 gap-3 mb-8">
                {PREFERENCES.map(pref => {
                  const isSelected = selectedPrefs.includes(pref.id);
                  return (
                    <button
                      key={pref.id}
                      onClick={() => togglePref(pref.id)}
                      className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-300 ${
                        isSelected 
                          ? 'border-[color:oklch(0.58_0.22_var(--accent-hue))] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] shadow-(--shadow-glow)' 
                          : 'border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong)'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${isSelected ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-primary)'}`}>{pref.label}</span>
                        {isSelected && <Check size={16} className="text-[color:oklch(0.58_0.22_var(--accent-hue))]" />}
                      </div>
                      <span className="text-xs text-(--text-muted)">{pref.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex gap-3">
                <Button variant="secondary" onClick={prevStep} className="px-6" disabled={loading}>Back</Button>
                <Button onClick={handleComplete} loading={loading} className="flex-1">
                  Complete Setup
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
