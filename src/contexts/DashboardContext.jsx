import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardData, saveDashboardData } from '../services/dashboardStorage';
import { useUser } from './UserContext';
import {
  userDoc,
  userTasks,
  userNotifications,
  roomsRef,
  usersRef,
  fetchDoc,
  fetchQuery,
  createDoc,
  patchDoc,
  removeDoc,
  safeOnSnapshot,
  query,
  where,
  orderBy,
  limit,
  doc,
  serverTimestamp,
  timeAgo,
} from '../firebase/firestore';

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
  const { user, isLoggedIn } = useUser();
  const uid = user?.id;

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

  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [dailyGoal, setDailyGoal] = useState({ target: 4, current: 0, streak: 0, xpToday: 0 });

  // ─── REAL-TIME: USER TASKS (limit 50 for zero-cost quota safety) ───
  useEffect(() => {
    if (!uid) return;

    const q = query(userTasks(uid), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = safeOnSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: timeAgo(d.data().createdAt),
      }));
      setTasks(items);
    }, (err) => {
      console.error('Tasks listener error:', err);
    });

    return () => unsubscribe();
  }, [uid]);

  // ─── REAL-TIME: NOTIFICATIONS ───
  useEffect(() => {
    if (!uid) return;

    const q = query(userNotifications(uid), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = safeOnSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        time: timeAgo(d.data().createdAt),
      })));
    });

    return () => unsubscribe();
  }, [uid]);

  // ─── LEADERBOARD: Top users by XP ───
  useEffect(() => {
    if (!isLoggedIn) return;

    const q = query(usersRef, orderBy('xp', 'desc'), limit(10));
    const unsubscribe = safeOnSnapshot(q, (snap) => {
      setLeaderboard(snap.docs.map((d, i) => ({
        id: d.id,
        name: d.data().name || 'Anonymous',
        xp: d.data().xp || 0,
        rank: i + 1,
        avatar: d.data().avatar,
      })));
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  // ─── USER'S ACTIVE ROOMS ───
  useEffect(() => {
    if (!uid) return;

    const q = query(roomsRef, where('memberIds', 'array-contains', uid), limit(5));
    const unsubscribe = safeOnSnapshot(q, (snap) => {
      setActiveRooms(snap.docs.map(d => ({
        id: d.id,
        name: d.data().name,
        participants: d.data().memberCount || 0,
        category: d.data().category,
      })));
    });

    return () => unsubscribe();
  }, [uid]);

  // ─── DAILY GOAL derived from user data ───
  useEffect(() => {
    if (!user) return;
    setDailyGoal({
      target: 4,
      current: Math.min(user.xp ? (user.xp % 500) / 125 : 0, 4),
      streak: user.streak || 0,
      xpToday: user.xp ? user.xp % 500 : 0,
    });
  }, [user]);

  // ─── TASK CRUD ───
  const toggleTask = useCallback(async (taskId) => {
    if (!uid) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    await patchDoc(doc(userTasks(uid), taskId), { completed: !task.completed });
  }, [uid, tasks]);

  const addTask = useCallback(async (title, priority = 'medium') => {
    if (!uid || !title.trim()) return;
    await createDoc(userTasks(uid), { title, completed: false, priority });
  }, [uid]);

  const deleteTask = useCallback(async (taskId) => {
    if (!uid) return;
    await removeDoc(doc(userTasks(uid), taskId));
  }, [uid]);

  // ─── NOTIFICATION MANAGEMENT ───
  const markNotificationRead = useCallback(async (notifId) => {
    if (!uid) return;
    await patchDoc(doc(userNotifications(uid), notifId), { read: true });
  }, [uid]);

  const clearNotifications = useCallback(async () => {
    if (!uid) return;
    for (const n of notifications) {
      await removeDoc(doc(userNotifications(uid), n.id));
    }
  }, [uid, notifications]);

  const xpToday = computeXpToday(dashboardState);

  return (
    <DashboardContext.Provider value={{
      tasks,
      toggleTask,
      addTask,
      deleteTask,
      activeRooms: activeRooms.length > 0 ? activeRooms : MOCK_ACTIVE_ROOMS,
      upcomingSessions: upcomingSessions.length > 0 ? upcomingSessions : MOCK_UPCOMING_SESSIONS,
      recentActivity: recentActivity.length > 0 ? recentActivity : MOCK_RECENT_ACTIVITY,
      leaderboard: leaderboard.length > 0 ? leaderboard : MOCK_LEADERBOARD,
      notifications: notifications.length > 0 ? notifications : MOCK_NOTIFICATIONS,
      markNotificationRead,
      clearNotifications,
      xp: dashboardState.xp,
      xpToday,
      hoursThisWeek: dashboardState.hoursThisWeek,
      dailyGoal: {
        target: dashboardState.target,
        current: dashboardState.current,
        streak: dashboardState.streak,
        lastActiveDate: dashboardState.lastActiveDate,
        xpToday,
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
