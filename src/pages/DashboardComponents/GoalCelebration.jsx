import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useDashboard } from '../../contexts/DashboardContext';
import { Toast } from '../../components/ui/Toast';

const GOAL_CONFETTI = {
  particleCount: 80,
  spread: 60,
  origin: { y: 0.6 },
  colors: ['#8b5cf6', '#3b82f6', '#10b981'],
};

const BONUS_CONFETTI = {
  particleCount: 200,
  spread: 100,
  origin: { y: 0.5 },
  colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
};

export default function GoalCelebration() {
  const { activeCelebration, clearCelebration } = useDashboard();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!activeCelebration) return;

    if (activeCelebration === 'goal') {
      confetti(GOAL_CONFETTI);
      setToast({ type: 'success', message: 'Daily goal reached!' });
    } else if (activeCelebration === 'bonus') {
      confetti(BONUS_CONFETTI);
      setTimeout(() => confetti({ ...BONUS_CONFETTI, particleCount: 120, spread: 80 }), 200);
      setToast({ type: 'success', message: '7-hour marathon! +200 XP' });
    }

    clearCelebration();
  }, [activeCelebration, clearCelebration]);

  if (!toast) return null;

  return (
    <Toast
      type={toast.type}
      message={toast.message}
      onClose={() => setToast(null)}
    />
  );
}
