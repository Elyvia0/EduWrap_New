import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardData, saveDashboardData } from '../services/dashboardStorage';

const DashboardContext = createContext(null);

const MOCK_TASKS = [
  { id: '1', title: 'Finish Physics Chapter 4', completed: false, priority: 'high' },
  { id: '2', title: 'Review Calculus Notes', completed: false, priority: 'medium' },
  { id: '3', title: 'Reply to study group', completed: true, priority: 'low' },
];

const MOCK_ACTIVE_ROOMS = [
  { id: 'r1', name: 'Physics 101 Midterm Prep', participants: 12, category: 'Science' },
  { id: 'r2', name: 'CS50 Study Group', participants: 5, category: 'Programming' },
];

const MOCK_UPCOMING_SESSIONS = [
  { id: 's1', title: 'Calculus Review', time: 'In 15 mins', members: 4 },
  { id: 's2', title: 'Chemistry Lab Prep', time: 'Tomorrow, 2 PM', members: 8 },
];

const MOCK_RECENT_ACTIVITY = [
  { id: 'a1', text: 'You earned the "Night Owl" badge', time: '2h ago', type: 'badge' },
  { id: 'a2', text: 'Alex updated "Cell Biology Notes"', time: '4h ago', type: 'note' },
  { id: 'a3', text: 'Completed "Thermodynamics Quiz" (92%)', time: 'Yesterday', type: 'quiz' },
];

const MOCK_LEADERBOARD = [
  { id: 'l1', name: 'Sarah J.', xp: 12450, rank: 1 },
  { id: 'l2', name: 'Alex C.', xp: 11200, rank: 2 },
  { id: 'l3', name: 'You', xp: 10850, rank: 3 },
  { id: 'l4', name: 'Mike T.', xp: 9800, rank: 4 },
  { id: 'l5', name: 'Emma W.', xp: 9400, rank: 5 },
];

const MOCK_NOTIFICATIONS = [
  { id: 'n1', text: 'Sarah invited you to "Data Structures"', read: false },
  { id: 'n2', text: 'Chemistry Quiz deadline in 2 days', read: false },
  { id: 'n3', text: 'You were mentioned in General Chat', read: true },
];

const DEFAULT_STATE = {
  target: 4,
  current: 0,
  streak: 0,
  lastActiveDate: null,
  date: null,
  xp: 0,
  xpMonth: null,
  hoursThisWeek: 0,
  weekStart: null,
  goalCelebrated: false,
  goalCelebratedForDate: null,
  bonusClaimed: false,
  bonusClaimedForDate: null,
};

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getMondayOfWeek(dateStr) {
  const d = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function computeDailyXP(current, target) {
  if (target <= 0) return 0;
  return Math.round(Math.min(current / target, 1) * 50);
}

function loadInitialState() {
  const stored = getDashboardData();
  const today = getTodayString();
  const currentMonth = getCurrentMonth();
  const monday = getMondayOfWeek(today);

  if (!stored) {
    return {
      ...DEFAULT_STATE,
      xp: 100,
      xpMonth: currentMonth,
      weekStart: monday,
    };
  }

  return {
    ...DEFAULT_STATE,
    xpMonth: currentMonth,
    weekStart: monday,
    ...stored,
  };
}

/**
 * Shared day-change check: finalizes previous day XP/hours, resets current,
 * updates streak, and resets per-day celebration flags.
 */
function applyDayChange(state) {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const currentMonth = getCurrentMonth();
  const monday = getMondayOfWeek(today);

  let {
    target,
    current,
    streak,
    lastActiveDate,
    date,
    xp,
    xpMonth,
    hoursThisWeek,
    weekStart,
    goalCelebrated,
    goalCelebratedForDate,
    bonusClaimed,
    bonusClaimedForDate,
  } = state;

  const isNewDay = date !== null && date !== today;

  if (isNewDay) {
    const prevCurrent = current;
    const prevTarget = target;
    const prevDate = date;

    let prevDayXP = computeDailyXP(prevCurrent, prevTarget);
    if (bonusClaimed && bonusClaimedForDate === prevDate) {
      prevDayXP += 200;
    }

    if (weekStart !== monday) {
      hoursThisWeek = 0;
      weekStart = monday;
    }
    hoursThisWeek += prevCurrent;

    if (xpMonth !== currentMonth) {
      xp = 0;
      xpMonth = currentMonth;
    }
    xp += prevDayXP;

    current = 0;
    date = today;
    goalCelebrated = false;
    goalCelebratedForDate = null;
    bonusClaimed = false;
    bonusClaimedForDate = null;
  } else if (date !== today) {
    current = 0;
    date = today;
    if (!weekStart) weekStart = monday;
    if (!xpMonth) xpMonth = currentMonth;
    goalCelebrated = false;
    goalCelebratedForDate = null;
    bonusClaimed = false;
    bonusClaimedForDate = null;
  }

  if (lastActiveDate !== today) {
    if (lastActiveDate === yesterday) {
      streak += 1;
    } else {
      streak = 0;
    }
    lastActiveDate = today;
  }

  return {
    target,
    current,
    streak,
    lastActiveDate,
    date,
    xp,
    xpMonth,
    hoursThisWeek,
    weekStart,
    goalCelebrated,
    goalCelebratedForDate,
    bonusClaimed,
    bonusClaimedForDate,
  };
}

function detectCelebration(prev, newCurrent, today) {
  const prevRatio = prev.current / prev.target;
  const newRatio = newCurrent / prev.target;
  let celebration = null;
  const updates = {};

  if (newRatio >= 1 && prevRatio < 1 && prev.goalCelebratedForDate !== today) {
    updates.goalCelebrated = true;
    updates.goalCelebratedForDate = today;
    celebration = 'goal';
  }

  if (newCurrent >= 7 && prev.current < 7 && prev.bonusClaimedForDate !== today) {
    updates.bonusClaimed = true;
    updates.bonusClaimedForDate = today;
    celebration = 'bonus';
  }

  return { celebration, updates };
}

function computeXpToday(state) {
  const today = getTodayString();
  const dailyXP = computeDailyXP(state.current, state.target);
  const bonusToday =
    state.bonusClaimed && state.bonusClaimedForDate === today ? 200 : 0;
  return dailyXP + bonusToday;
}

export function DashboardProvider({ children }) {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [dashboardState, setDashboardState] = useState(() =>
    applyDayChange(loadInitialState())
  );
  const [activeCelebration, setActiveCelebration] = useState(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    saveDashboardData(dashboardState);
  }, [dashboardState]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const today = getTodayString();
    setDashboardState((prev) => {
      const { celebration, updates } = detectCelebration(prev, prev.current, today);
      if (celebration) {
        setActiveCelebration(celebration);
        return { ...prev, ...updates };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;

      setDashboardState((prev) => {
        const today = getTodayString();
        let next = prev;

        if (prev.date !== today || prev.lastActiveDate !== today) {
          next = applyDayChange(prev);
        }

        const prevCurrent = next.current;
        const newCurrent = prevCurrent + 30 / 3600;
        const { celebration, updates } = detectCelebration(next, newCurrent, today);

        const updated = { ...next, ...updates, current: newCurrent, date: today };
        saveDashboardData(updated);

        if (celebration) {
          setActiveCelebration(celebration);
        }

        return updated;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const clearCelebration = useCallback(() => {
    setActiveCelebration(null);
  }, []);

  const setGoalTarget = useCallback((hours) => {
    const clamped = Math.min(12, Math.max(1, Number(hours) || 4));
    setDashboardState((prev) => ({ ...prev, target: clamped }));
  }, []);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (title, priority = 'medium') => {
    if (!title.trim()) return;
    setTasks([{ id: Date.now().toString(), title, completed: false, priority }, ...tasks]);
  };

  const xpToday = computeXpToday(dashboardState);

  return (
    <DashboardContext.Provider value={{
      tasks,
      toggleTask,
      addTask,
      activeRooms: MOCK_ACTIVE_ROOMS,
      upcomingSessions: MOCK_UPCOMING_SESSIONS,
      recentActivity: MOCK_RECENT_ACTIVITY,
      leaderboard: MOCK_LEADERBOARD,
      notifications: MOCK_NOTIFICATIONS,
      xp: dashboardState.xp,
      xpToday,
      hoursThisWeek: dashboardState.hoursThisWeek,
      dailyGoal: {
        target: dashboardState.target,
        current: dashboardState.current,
        streak: dashboardState.streak,
        lastActiveDate: dashboardState.lastActiveDate,
      },
      setGoalTarget,
      activeCelebration,
      clearCelebration,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
