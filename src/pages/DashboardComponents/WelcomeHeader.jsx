import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { Zap, Target } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

function formatHours(hours) {
  return Number(hours).toFixed(1);
}

export default function WelcomeHeader() {
  const { user } = useUser();
  const { dailyGoal, setGoalTarget } = useDashboard();
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState(String(dailyGoal.target));

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const progress = Math.min(100, (dailyGoal.current / dailyGoal.target) * 100);
  const hoursLeft = Math.max(0, dailyGoal.target - dailyGoal.current);

  const openGoalModal = () => {
    setGoalInput(String(dailyGoal.target));
    setGoalModalOpen(true);
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    setGoalTarget(Number(goalInput));
    setGoalModalOpen(false);
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {greeting}, <span className="bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_var(--accent-hue))] text-transparent bg-clip-text">{user.name.split(' ')[0]}</span>.
        </h1>
        <p className="text-(--text-secondary)">
          Let's make today count. You have {formatHours(hoursLeft)} hours left to hit your goal.
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button variant="outline" size="sm" onClick={openGoalModal} className="shrink-0">
          <Target size={16} />
          Set Goal
        </Button>

        <div className="flex items-center gap-4 bg-(--bg-glass) backdrop-blur-md border border-(--border-subtle) rounded-2xl p-4 shadow-(--shadow-glow) flex-1 md:flex-initial">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-(--border-default)" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[color:oklch(0.58_0.22_var(--accent-hue))]" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * progress) / 100} strokeLinecap="round" />
            </svg>
            <Zap size={16} className="absolute text-[color:oklch(0.58_0.22_var(--accent-hue))] fill-current" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-(--text-muted) uppercase font-bold tracking-wider">Daily Goal</span>
            <span className="text-sm font-semibold">{formatHours(dailyGoal.current)} / {dailyGoal.target} hrs</span>
          </div>
          
          <div className="w-px h-8 bg-(--border-default) mx-2"></div>
          
          <div className="flex flex-col">
            <span className="text-xs text-(--text-muted) uppercase font-bold tracking-wider">Streak</span>
            <span className="text-sm font-semibold flex items-center gap-1">{dailyGoal.streak} Days 🔥</span>
          </div>
        </div>
      </div>

      <Modal isOpen={goalModalOpen} onClose={() => setGoalModalOpen(false)} title="Set Daily Goal">
        <form onSubmit={handleGoalSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="goal-hours" className="block text-sm font-medium text-(--text-secondary) mb-2">
              Hours per day
            </label>
            <Input
              id="goal-hours"
              type="number"
              min={1}
              max={12}
              step={1}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              required
            />
            <p className="text-xs text-(--text-muted) mt-2">Choose between 1 and 12 hours.</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setGoalModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Goal</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
