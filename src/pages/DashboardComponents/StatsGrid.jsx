import { motion } from 'framer-motion';
import { Clock, Flame, Users } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

const StatCard = ({ icon: Icon, label, value, subtext }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) rounded-2xl p-5 hover:-translate-y-1 hover:shadow-(--shadow-glow) transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] flex items-center justify-center text-[color:oklch(0.58_0.22_var(--accent-hue))] shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <div className="text-(--text-secondary) text-sm font-medium">{label}</div>
        <div className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
      </div>
    </div>
    {subtext && (
      <div className="mt-4 pt-3 border-t border-(--border-default) text-xs text-(--text-muted) flex items-center gap-1">
        {subtext}
      </div>
    )}
  </motion.div>
);

function formatWeeklyHours(hours) {
  const h = Number(hours);
  const rounded = Math.round(h * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}h` : `${rounded.toFixed(1)}h`;
}

export default function StatsGrid() {
  const { xp, xpToday, hoursThisWeek, dailyGoal } = useDashboard();
  const weeklyTotal = hoursThisWeek + dailyGoal.current;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard
        icon={Flame}
        label="Total XP"
        value={xp.toLocaleString()}
        subtext={<><span className="text-green-500 font-medium">+{xpToday}</span> earned today</>}
      />
      <StatCard
        icon={Clock}
        label="Hours Studied"
        value={formatWeeklyHours(weeklyTotal)}
        subtext="This week"
      />
      <StatCard
        icon={Users}
        label="Active Groups"
        value="3"
        subtext="2 sessions scheduled"
      />
    </div>
  );
}
