import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, Zap, Settings, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';
import { CountBadge } from '../ui/Badge';

export default function Topbar({ onMenuClick, onOpenCommandPalette }) {
  const { user, logout } = useUser();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const toggleTheme = (e) => {
    // If system, switch to the opposite of current OS theme, else toggle
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'light' : 'dark', e);
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark', e);
    }
  };

  return (
    <header className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 h-16 border-b border-(--border-default) bg-(--bg-elevated)/80 backdrop-blur-md shrink-0 sticky top-0 z-30 overflow-hidden">
      {/* Mobile menu toggle */}
      <IconButton 
        variant="ghost" 
        className="lg:hidden" 
        onClick={onMenuClick} 
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </IconButton>

      {/* Global Search / Command Palette Trigger */}
      <button 
        onClick={onOpenCommandPalette}
        className="flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-xl bg-(--bg-glass) border border-(--border-default) hover:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.4)] transition-all text-left text-(--text-muted) group"
      >
        <Search size={16} className="group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors" />
        <span className="flex-1 text-sm truncate">Search or type a command...</span>
        <div className="hidden sm:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded shadow-sm bg-(--bg-elevated) border border-(--border-strong) text-[10px] font-mono font-medium">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded shadow-sm bg-(--bg-elevated) border border-(--border-strong) text-[10px] font-mono font-medium">K</kbd>
        </div>
      </button>

      <div className="flex-1" />

      {/* Streak / Gamification */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)] text-[color:oklch(0.58_0.22_var(--accent-hue))] font-semibold text-xs shadow-(--shadow-glow)">
        <Zap size={14} className="fill-current" />
        <span>12 Day Streak</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <IconButton variant="ghost" aria-label="Toggle Theme" onClick={toggleTheme}>
          {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? <Moon size={18} /> : <Sun size={18} />}
        </IconButton>

        <Dropdown 
          align="right"
          trigger={
            <div className="relative">
              <IconButton variant="ghost" aria-label="Notifications">
                <Bell size={18} />
              </IconButton>
              <div className="absolute -top-0.5 -right-0.5 pointer-events-none">
                <CountBadge count={3} variant="error" size="sm" className="!text-[8px] !min-w-[16px] !h-[16px] !px-1 shadow-sm" />
              </div>
            </div>
          }
        >
          <div className="px-4 py-2 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">Notifications</div>
          <DropdownItem>New material in Physics 301</DropdownItem>
          <DropdownItem>Alex mentioned you</DropdownItem>
          <DropdownItem>Upcoming quiz reminder</DropdownItem>
        </Dropdown>

        <div className="w-px h-6 bg-(--border-default) hidden sm:block" />

        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-(--bg-glass) transition-colors">
              <Avatar initials={user.name.charAt(0)} status="online" size="sm" />
            </div>
          }
        >
          <div className="px-4 py-3 border-b border-(--border-default) mb-1">
            <div className="text-sm font-semibold text-(--text-primary)">{user.name}</div>
            <div className="text-xs text-(--text-muted) truncate">{user.email || 'student@university.edu'}</div>
          </div>
          <DropdownItem icon={UserIcon} onClick={() => navigate('/profile')}>Profile</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => navigate('/settings')}>Account Settings</DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} className="text-red-500 hover:!bg-red-500/10" onClick={() => { logout(); navigate('/'); }}>Log out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
