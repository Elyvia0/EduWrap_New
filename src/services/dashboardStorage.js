const STORAGE_KEY = 'ew_dashboard_data';
const LEGACY_KEY = 'ew_daily_goal';

export function getDashboardData() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_KEY);
      if (raw) {
        localStorage.removeItem(LEGACY_KEY);
      }
    }
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDashboardData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
