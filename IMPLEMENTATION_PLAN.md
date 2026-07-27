# 📋 EduWrap — Implementation Plan

## Current Status

**What exists today:**
- React 19 + Vite 8 project (working)
- React Router DOM 7 routing (working)
- CSS Modules styling replaced entirely with Tailwind CSS v4
- Lucide React icons (keep)
- 4 pages built: Landing, Dashboard, Rooms, StudyRoom (will be rebuilt)
- UserContext with localStorage persistence (keep pattern, expand)
- Theme system and Accent system active
- Completed Phases 0 through 4 (Foundation, Design System, UI Components, App Shell, Landing)

**Important Architecture Notes for AI Agents:**
1. **Tailwind v4 Variables:** We strictly use Tailwind v4 arbitrary syntax. DO NOT use `bg-[var(--bg-elevated)]`. YOU MUST USE `bg-(--bg-elevated)`. All CSS variables map natively in v4 using parentheses.
2. **Global Specificity:** A `@layer base` wrapper is used in `index.css` to prevent `* { margin: 0 }` from overriding Tailwind utilities. If you write custom CSS, always put it in a `@layer`.
3. **Animations:** We heavily use `framer-motion`. For any blurred or heavy animation, always attach `will-change-transform transform-gpu` to the `className`.
4. **Data Persistence:** Because there is no backend, every single interactive phase MUST use React Context combined with `localStorage` so data persists across reloads.
5. **UI Aesthetic:** Premium SaaS. Use glassmorphism (`bg-(--bg-glass) backdrop-blur-md`), deep shadows, and subtle gradients. Avoid flat, boring designs.

---

## Tech Stack (React-Only Phase)

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Vite 8) |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| State | React Context API + localStorage |
| Fonts | Inter, Sora, JetBrains Mono |

**NOT using (deferred):** Next.js, TypeScript, backend, databases, real APIs

---

## Phase Breakdown

---

### ✅ PHASE 0 — Foundation Reset (DONE)
> Install dependencies, configure Tailwind, set up fonts, clean old CSS Modules.

- [x] Install Tailwind CSS 4 + configure with Vite
- [x] Install Framer Motion
- [x] Add Google Fonts: Inter (UI), Sora (hero headings), JetBrains Mono (code)
- [x] Remove all `.module.css` files
- [x] Remove `App.css`
- [x] Rewrite `index.css` as Tailwind base with CSS variable design tokens
- [x] Verify project builds and runs clean

---

### ✅ PHASE 1 — Design System & Theming (DONE)
> Build the global theme system, accent color system, and CSS variable architecture.

- [x] **Theme system** — light / dark / system toggle
  - CSS variables for all color tokens (bg, surface, text, border, accent)
  - Light theme: soft whites, glass cards, clean shadows
  - Dark theme: deep navy-black, glowing accents, glass overlays
  - `ThemeContext` provider with localStorage persistence
  - Smooth instant theme transitions
- [x] **Accent color system** — dynamic user-selectable accent
  - Support: violet, purple, blue, cyan, green, emerald, orange, red, pink
  - CSS variables: `--accent`, `--accent-hover`, `--accent-dim`, `--accent-glow`
  - `AccentContext` or merge into ThemeContext
  - Auto-updates: buttons, active states, focus rings, progress bars, sidebar highlights
- [x] **Tailwind config** — extend with custom tokens
  - Colors, fonts, spacing, border-radius, shadows, backdrop-blur
  - Glassmorphism utility classes
- [x] **Typography scale** — headings, body, captions, code
- [x] **Spacing & layout tokens** — sidebar width, topbar height, panel gaps

---

### ✅ PHASE 2 — Reusable UI Component Library (DONE)
> Build all shared components before any pages. Every component supports dark/light + accent colors.

- [x] **Button** — primary, secondary, ghost, danger, outline; sizes sm/md/lg; loading state
- [x] **Input** — text, search, textarea; focus ring with accent
- [x] **Card** — glass card with hover elevation, depth variants
- [x] **Modal** — animated overlay + backdrop blur + Framer Motion
- [x] **Tooltip** — hover tooltips with smooth fade
- [x] **Toast / Notification** — portal-based, animated slide-in, auto-dismiss
- [x] **Dropdown** — animated, keyboard-navigable
- [x] **Tabs** — animated underline/pill indicator
- [x] **Avatar** — image, initials, status dot, size variants
- [x] **Progress Ring** — SVG circular progress with animation
- [x] **Badge** — status badges, count badges
- [x] **Skeleton Loader** — shimmer loading placeholders
- [x] **Empty State** — illustrated empty states with CTA
- [x] **File Card** — PDF, image, video, doc, link variants
- [x] **Floating Panel** — draggable/resizable overlay panels
- [ ] **AI Widget** — glowing AI interaction card

---

### ✅ PHASE 3 — App Shell & Navigation (DONE)
> Build the persistent layout structure: sidebar, topbar, workspace area, command palette.

- [x] **AppLayout** — sidebar + topbar + main content + optional right panel
- [x] **Sidebar** — collapsible (full → icon-only), smooth animation
  - Nav items: Dashboard, Study Rooms, Notes, Flashcards, Quiz, Doubts, Files, Profile, Settings
  - Active state with accent glow
  - Hover tooltips in collapsed mode
  - Unread count badges
  - Animated collapse/expand
- [x] **Topbar** — global search, notifications dropdown, streak indicator, user avatar menu, quick actions
- [x] **Command Palette** — `Cmd+K` / `Ctrl+K`
  - Animated overlay with blur background
  - Global search, quick navigation, recent items, quick actions
- [x] **Responsive behavior**
  - Desktop: persistent sidebar
  - Tablet: collapsible sidebar
  - Mobile: bottom nav or hamburger drawer
- [x] **Page transition animations** — Framer Motion `AnimatePresence`

---

### ✅ PHASE 4 — Landing Page (DONE)
> World-class SaaS marketing page. First impression = everything.

- [x] **Floating Navbar** — logo, Features, Pricing, About, Login, Sign Up CTA; blur-on-scroll
- [x] **Hero Section**
  - Giant headline (Sora font), animated gradient background
  - Floating UI mockup previews
  - CTA buttons (Get Started, Watch Demo)
  - Animated particles / light effects
  - Stats bar (students, groups, satisfaction)
- [x] **Features Section** — 8 glassmorphic animated cards
  - Study Rooms, AI Assistant, Flashcards, Live Collaboration, Quizzes, Notes, Gamification, File Sharing
- [x] **Interactive Demo Section** — fake live previews (chat, dashboard, AI, notes)
- [x] **Social Proof** — testimonials, usage counters, university logos
- [x] **CTA Footer** — glowing call-to-action section
- [x] **Footer** — links, copyright, branding
- [x] All sections: scroll-triggered animations (Framer Motion `whileInView`)

---

### ✅ PHASE 5 — Authentication Pages (DONE)
> Premium glassmorphic auth flow. No real auth — just UI + localStorage.

- [x] **Login Page** — email/password form, social login buttons (Google, GitHub), animated background, floating shapes
- [x] **Signup Page** — similar to login with name field, password strength meter
- [x] **Onboarding Flow** — multi-step stepper after "signup"
  - Step 1: Name + avatar selection (with randomize button)
  - Step 2: Select subjects/interests (grid of pills)
  - Step 3: Study preferences (visual selection cards)
  - Step 4: Confetti celebration → navigate to dashboard
- [x] Store user data in UserContext + localStorage
- [x] Animated transitions between steps using framer-motion

---

### ✅ PHASE 6 — Dashboard (DONE)
> **Goal:** Data-rich but minimal. Should feel like a premium command center.

**Understanding & Instructions:**
The Dashboard is the home page of the logged-in experience. It aggregates data from the other modules (Study Rooms, Notes, Quizzes) and displays it beautifully using Bento-grid layouts and interactive charts.

**Core Components to Build:**
- `WelcomeHeader.jsx`: Personalized greeting based on time of day, displaying the user's current streak.
- `StatCard.jsx`: Glassmorphic cards for displaying high-level metrics (XP, level).
- `ActivityFeed.jsx`: A vertical timeline of simulated past actions.
- `LeaderboardMini.jsx`: A small tabular view of top students.

**State Management (`DashboardContext` or Mock Data):**
- Create mock arrays for `recentActivities`, `upcomingSessions`, and `analyticsData`.
- Use `UserContext` for XP and streak.

**UI/UX Requirements:**
- Animated number count-ups for stats (e.g., jumping from 0 to 500 XP smoothly).
- Hover interactions on cards that slightly lift them `hover:-translate-y-1` and increase shadow `hover:shadow-(--shadow-glow)`.

- [x] **Welcome header** — personalized greeting, streak indicator
- [x] **Stats grid** — XP, streak, level, study groups (animated counters)
- [x] **Level progress bar** — animated fill with XP count-up
- [x] **Quick action buttons** — New Room, Create Notes, Join Group, Take Quiz
- [x] **Recent study rooms** — card list with activity indicators
- [x] **Upcoming sessions** — schedule cards with time/members
- [x] **AI study suggestions** — glowing AI card with recommendations
- [x] **Activity feed** — recent actions timeline
- [x] **Recent notes** — compact note preview cards
- [x] **Leaderboard preview** — top 5 users mini-table
- [x] **Analytics cards** — study time, quizzes completed, notes created charts
- [x] All cards: glassmorphic, hover interactions, animated graphs

---

### ✅ PHASE 7 — Study Room System (CORE — DONE)
> **Goal:** The heart of EduWrap. Discord + Notion + Google Classroom architecture.

**Understanding & Instructions:**
This is the most complex phase. A "Room" contains multiple "Classrooms" (like Discord servers containing channels). You need to build a discovery page to find rooms, a creation modal to make new ones, and the actual Room Layout which includes a dedicated left sidebar for navigation and a right sidebar for members/chat.

**Core Components to Build:**
- `RoomDiscovery.jsx`: A grid of available rooms with a search bar.
- `RoomLayout.jsx`: A 3-pane layout specific to a study room (Sub-sidebar, Main Content, Right Panel).
- `ClassroomList.jsx`: The navigation panel inside a room to switch between chats, notes, and video calls.

**State Management (`RoomContext`):**
- **Structure:** `rooms: [{ id, name, category, members, classrooms: [{ id, type, name }] }]`
- **Active State:** `activeRoomId`, `activeClassroomId`.

**UI/UX Requirements:**
- The transitions between classrooms should be seamless and use `AnimatePresence`.
- Active users in voice/video channels should have a subtle pulsing green ring.

#### 7A — Study Room Discovery Page
- [x] Search bar with filters
- [x] Category grid: Engineering, Medical, Business, Programming, Competitive Exams, etc.
- [x] Trending rooms, recently active, recommended, featured
- [x] Room cards: banner, member count, active users, tags, category, join button
- [x] Private room join: paste invite code / room ID modal

#### 7B — Study Room Creation
- [x] Create room modal/page
  - Room name, icon/banner, description, category, tags
  - Privacy: public / private
  - Initial classroom setup
- [x] Generated invite code/link

#### 7C — Study Room Layout (Main UI)
- [x] **Left sidebar**: room nav, classroom list (collapsible), unread indicators, live session glow, admin controls
- [x] **Center area**: active classroom workspace
- [x] **Right sidebar**: persistent chat, online members, pinned messages, AI assistant, activity feed
- [x] **Bottom toolbar**: voice controls, upload, quick actions, AI actions
- [x] Animated room/classroom switching

#### 7D — Classroom System
- [x] Create/manage classrooms inside a room
- [x] Classroom types with adapted UI:
  - Discussion (chat-focused)
  - Notes (editor-focused)
  - Live Session (video/audio)
  - Quiz (quiz interface)
  - Resources (file manager)
  - Project (collaboration)
- [x] Per-classroom: separate chat, files, notes, activity
- [x] Access control UI: public, private, read-only, admin-only

#### 7E — Admin & Role Management UI
- [x] Roles: Owner, Admin, Moderator, Member
- [x] Permission panel: manage members, lock classrooms, create invite links
- [x] Role-based UI visibility
- [x] Member management: mute, remove, assign roles

#### 7F — Live Activity
- [x] Active member indicators
- [x] Typing indicators
- [x] Join/leave animations
- [x] Activity feed per room
- [x] Unread counts per classroom
- [x] Active classroom glow effect

---

### ⏳ PHASE 8 — Chat System
> **Goal:** Modern Discord-quality chat UI.

**Understanding & Instructions:**
This is the messaging interface. It must handle scrolling correctly (staying at the bottom when new messages arrive). 

**Core Components to Build:**
- `MessageList.jsx`: The scrollable area containing messages.
- `MessageBubble.jsx`: Differentiates between 'me' and 'others'.
- `ChatInput.jsx`: A growing textarea with an emoji picker button and attachment clip.

**State Management (`ChatContext`):**
- **Structure:** `messages: [{ id, senderId, text, timestamp, reactions: {} }]`
- Save to localStorage so chats persist.

**UI/UX Requirements:**
- Messages must smoothly slide up and fade in when they appear.
- Hovering over a message should reveal a small quick-reaction bar.

- [ ] Message list with smooth enter animations
- [ ] Chat bubbles: self vs others styling
- [ ] Reactions, threaded replies, mentions, timestamps
- [ ] Typing indicator with animated dots
- [ ] Emoji picker
- [ ] File attachment UI
- [ ] Read receipts
- [ ] Pinned messages panel
- [ ] Smooth scroll, auto-scroll to bottom
- [ ] Mock data with simulated responses

---

### ⏳ PHASE 9 — Notes Editor
> **Goal:** Notion-inspired, distraction-free writing experience.

**Understanding & Instructions:**
A rich text editor clone. Rather than building a full slate/prosemirror editor from scratch, you can implement a block-like UI using multiple contenteditable divs, or a very polished single textarea with markdown parsing.

**Core Components to Build:**
- `NotesEditor.jsx`: The main typing interface.
- `SlashMenu.jsx`: A floating popup that appears when `/` is typed.
- `Toolbar.jsx`: Formatting options (bold, italic, H1, H2).

**State Management (`NotesContext`):**
- **Structure:** `notes: [{ id, title, content, tags, lastEdited }]`
- Auto-save logic utilizing `useEffect` and `setTimeout`.

**UI/UX Requirements:**
- Must look incredibly clean—almost entirely blank page until you start typing.
- Typography is critical here: use `prose` classes or strict typography rules for readability.

- [ ] Block-based editor (headings, paragraphs, lists, code, dividers)
- [ ] Markdown shortcuts
- [ ] Slash command menu (/)
- [ ] Floating formatting toolbar
- [ ] AI summarize button (mock)
- [ ] Tags system
- [ ] Auto-save indicator
- [ ] Note linking
- [ ] Word/character count
- [ ] localStorage persistence
- [ ] Notes library/listing page

---

### ⏳ PHASE 10 — Flashcard System
> **Goal:** Polished Quizlet-like experience.

**Understanding & Instructions:**
Users create decks of cards and study them. The core interaction is the 3D card flip animation.

**Core Components to Build:**
- `DeckGrid.jsx`: Shows available decks with progress rings.
- `FlashcardStudy.jsx`: The active study interface.
- `Card3D.jsx`: Uses Framer Motion `rotateY` for a smooth 3D flip effect.

**State Management (`FlashcardContext`):**
- **Structure:** `decks: [{ id, title, cards: [{ front, back, status: 'new'|'learning'|'known' }] }]`

**UI/UX Requirements:**
- The 3D flip must preserve depth (use `preserve-3d` and `backface-hidden` CSS properties).
- Swipe gestures (or arrow keys) to move to the next card.

- [ ] Deck library page with progress rings
- [ ] Create/edit deck
- [ ] Study mode — animated 3D card flip
- [ ] Progress tracking (known/learning/new)
- [ ] Spaced repetition indicators
- [ ] Study analytics
- [ ] AI deck generation UI (mock)

---

### ⏳ PHASE 11 — Quiz System
> **Goal:** Focus-mode quiz experience.

**Understanding & Instructions:**
A gamified multiple-choice quiz environment. Needs to handle timers and scoring.

**Core Components to Build:**
- `QuizPlayer.jsx`: The active quiz view showing one question at a time.
- `OptionButton.jsx`: Selectable answers.
- `QuizResults.jsx`: The final screen showing charts of performance.

**State Management (`QuizContext`):**
- **Structure:** `activeQuiz: { currentQuestionIndex, selectedAnswers: {}, score, timeRemaining }`

**UI/UX Requirements:**
- When an answer is selected, briefly flash green/red before proceeding to the next question.
- Confetti on high scores.

- [ ] Quiz selector/browser
- [ ] Quiz interface — questions, options, timer
- [ ] Answer feedback animations
- [ ] Animated score reveal
- [ ] Results analytics — weak topics, time per question
- [ ] Focus mode — minimal distraction UI
- [ ] Quiz history

---

### ⏳ PHASE 12 — Video Call UI
> **Goal:** Futuristic collaboration call. UI only, no WebRTC.

**Understanding & Instructions:**
This is purely a visual interface mocking a Zoom/Discord call.

**Core Components to Build:**
- `VideoGrid.jsx`: Dynamically resizes based on participant count (1x1, 2x2, 3x3).
- `ParticipantTile.jsx`: Displays avatar and fake webcam stream placeholder.
- `CallControls.jsx`: Floating pill with Mute/Video/Leave buttons.

**State Management:**
- **Structure:** `participants: [{ id, name, isSpeaking, isMuted, hasVideo }]`

**UI/UX Requirements:**
- Speaking indicator: A glowing border `ring-2 ring-(--accent-glow)` around the active speaker.
- Hover menus to adjust volume per participant.

- [ ] Participant video grid (mock placeholders)
- [ ] Self-view preview
- [ ] Floating control bar: mute, camera, screen share, reactions, leave
- [ ] Speaking indicators (border glow)
- [ ] Screen share preview
- [ ] Draggable notes overlay
- [ ] Chat accessible alongside call
- [ ] Emoji reactions

---

### ✅ PHASE 13 — Doubt Board (DONE)
> **Goal:** Academic Q&A feed.

**Understanding & Instructions:**
A forum-like feature within the app for asking and answering questions.

**Core Components to Build:**
- `QuestionFeed.jsx`: A list of questions.
- `QuestionDetail.jsx`: The thread view.
- `VoteControls.jsx`: Upvote/downvote arrows.

**State Management (`DoubtContext`):**
- **Structure:** `questions: [{ id, title, body, upvotes, isResolved, replies: [] }]`

**UI/UX Requirements:**
- Subtle pop animations on upvote.
- Clear "Resolved" badges (green pill).

- [ ] Post cards: title, description, tags, author, timestamp
- [ ] Upvote/downvote
- [ ] Answer threads
- [ ] AI answer panel (mock)
- [ ] Resolved badge
- [ ] Filtering: newest, popular, unanswered, resolved
- [ ] Tag browsing
- [ ] Create question form

---

### ⏳ PHASE 14 — File Manager
> **Goal:** Drag-and-drop file management.

**Understanding & Instructions:**
A Google Drive-style file explorer for study resources.

**Core Components to Build:**
- `DropZone.jsx`: An area that highlights when files are dragged over it.
- `FileGrid.jsx`: Uses the existing `FileCard` component.

**State Management (`FileContext`):**
- **Structure:** `files: [{ id, name, size, type, uploadDate }]`

**UI/UX Requirements:**
- Dotted border that animates when dragging a file over the screen.
- Icons specific to file types (PDF, Word, Image).

- [ ] Upload zone (drag-and-drop)
- [ ] File grid/list view toggle
- [ ] Type-specific file cards (PDF, image, video, doc, link)
- [ ] Search and filter
- [ ] File preview modal
- [ ] Storage usage indicator

---

### ✅ PHASE 15 — Profile & Gamification (DONE)
> **Goal:** Rewarding, motivating profile.

**Understanding & Instructions:**
A place where the user's hard work is visually rewarded.

**Core Components to Build:**
- `ContributionHeatmap.jsx`: A grid of small squares representing daily activity (like GitHub).
- `BadgeWall.jsx`: A gallery of unlocked achievements.

**UI/UX Requirements:**
- Glowing effects on rare/high-level badges.
- Smooth tooltips when hovering over heatmap squares.

- [x] Profile page — avatar, name, bio, stats
- [x] XP system — animated counter, level progress
- [x] Streak calendar — GitHub-style contribution grid
- [x] Badge wall — earned achievements
- [x] Study analytics — charts
- [x] Full leaderboard
- [x] Celebratory animations

---

### ✅ PHASE 16 — Settings (DONE)
> **Goal:** Clean, organized preferences.

**Understanding & Instructions:**
A unified interface for configuring the app. Ensure it connects properly to the `ThemeContext` already built.

**Core Components to Build:**
- `SettingsLayout.jsx`: A 2-column layout (nav on left, form on right).
- `ColorPicker.jsx`: A visual selector for the accent color system.

- [x] Theme switcher — light / dark / system
- [x] Accent color picker — visual grid
- [x] Notification preferences
- [x] Font size controls (merged with appearance)
- [x] Keyboard shortcuts reference (REMOVED based on feedback)
- [x] Account preferences
- [x] Danger zone — logout, reset

---

### ⏳ PHASE 17 — Final Polish
> **Goal:** Animation pass, edge cases, responsive audit.

- [ ] Page transition animations
- [ ] All loading skeletons
- [ ] All empty states
- [ ] Responsive audit: desktop, tablet, mobile
- [ ] Keyboard navigation
- [ ] Accessibility (ARIA labels, focus management)
- [ ] Performance (lazy loading, code splitting)
- [ ] Cross-browser testing

---

## Phase Dependencies

```
Phase 0 (Foundation)
  → Phase 1 (Design System)
    → Phase 2 (UI Components)
      → Phase 3 (App Shell)
        → Phase 4 (Landing)
        → Phase 5 (Auth)
        → Phase 6 (Dashboard)
        → Phase 7 (Study Rooms) ← CORE, largest
          → Phase 8 (Chat)
          → Phase 9 (Notes)
          → Phase 10 (Flashcards)
          → Phase 11 (Quiz)
          → Phase 12 (Video Call)
          → Phase 13 (Doubts)
          → Phase 14 (Files)
        → Phase 15 (Profile)
        → Phase 16 (Settings)
      → Phase 17 (Polish) ← after everything
```

Phases 4–16 can be done in any order after Phase 3, but Phase 7 (Study Rooms) should come before 8–14 since those features live inside rooms.

---

## Summary

| Phases | Count | Description |
|--------|-------|-------------|
| 0–1 | 2 | Foundation + Design System |
| 2–3 | 2 | Components + App Shell |
| 4–5 | 2 | Landing + Auth |
| 6 | 1 | Dashboard |
| 7 | 1 (6 sub-phases) | Study Room System (CORE) |
| 8–14 | 7 | Feature Pages |
| 15–16 | 2 | Profile + Settings |
| 17 | 1 | Final Polish |
| **Total** | **18 phases** | |


## Feature Update: Daily Goal & Real Streak

### Files involved
- src/contexts/DashboardContext.jsx
- src/pages/DashboardComponents/WelcomeHeader.jsx

### 1. Set Goal button
Add a "Set Goal" button immediately to the left of the Daily Goal / Streak
card in WelcomeHeader.jsx. Clicking it opens a modal (reuse the existing
Modal component from components/ui) with a number input for "hours per day"
(min 1, max 12). On submit, call a new `setGoalTarget(hours)` function from
DashboardContext and close the modal.

### 2. Persist daily goal state
In DashboardContext.jsx, replace the hardcoded `dailyGoal` object with real
state, persisted to localStorage (same pattern as the other contexts in this
app — read on mount, write on every change). Shape:

  {
    target: number,       // hours/day goal, user-settable, default 4
    current: number,       // hours studied today (leave logic as-is/mocked for now)
    streak: number,        // consecutive days used, starts at 0
    lastActiveDate: string | null   // ISO date "YYYY-MM-DD" of last active day
  }

### 3. Streak logic (runs once when DashboardProvider mounts)
Compare today's date to `lastActiveDate`:
- If lastActiveDate === today → no change (already counted today)
- If lastActiveDate === yesterday → streak += 1, lastActiveDate = today
- Otherwise (gap of 2+ days, or lastActiveDate is null/first-ever use) →
  streak = 0, lastActiveDate = today

Streak starts at 0 for a brand-new user and only climbs on genuinely
consecutive daily use. Missing a day resets it to 0.

### Constraints
- Follow existing Tailwind v4 arbitrary-value syntax (bg-(--var), not
  bg-[var(--var)])
- Don't touch tasks, activeRooms, or any other DashboardContext data
- Don't touch Notes, Quiz, Flashcards, Doubts, or Files

### 4. Real time tracking for "current" hours

Track actual time spent with the app open (not simulated). In
DashboardContext.jsx:

- On mount, start an interval (every 30 seconds) that only counts time
  while the tab is visible/focused — use the Page Visibility API
  (document.visibilityState === 'visible') so it doesn't count time when
  the user switches tabs or minimizes the browser.
- Each tick, add the elapsed seconds to `current` (converted to hours,
  e.g. current += 30/3600) and persist to localStorage immediately.
- `current` resets to 0 whenever the day changes (tie this into the same
  date-comparison logic already used for the streak check in section 3 —
  one shared "is this a new day" check should reset both `current` and
  decide the streak update, so they don't drift out of sync).
- Store the running total keyed by date, e.g.
  { date: "2026-07-22", hoursToday: 1.35 }, so a page refresh mid-session
  doesn't lose progress — reload from localStorage first, then resume
  the interval from there.
- Clear the interval on component unmount (cleanup function) to avoid
  memory leaks / duplicate timers.

### Constraint addition
- Do not use Web Workers or Service Workers for this — a simple
  setInterval + Page Visibility check is enough for this app's scale.

  ## Feature Update: Remove Level Card, Goal-Based XP, Real Weekly Hours

### Files involved
- src/pages/DashboardComponents/StatsGrid.jsx
- src/contexts/DashboardContext.jsx
- src/contexts/UserContext.jsx

### 1. Remove the "Current Level" stat card
In StatsGrid.jsx, delete the StatCard block with label="Current Level".
Change the grid from `lg:grid-cols-4` to `lg:grid-cols-3` so the remaining
three cards (Total XP, Hours Studied, Active Groups) space out evenly.

### 2. Move XP ownership to DashboardContext
Currently `xp` lives on the user object in UserContext.jsx and is hardcoded
(2400) every login. Change this:
- In UserContext.jsx's `login()` function, stop hardcoding xp/level/streak —
  just spread in the real userData, no mock overrides.
- In DashboardContext.jsx, add new persisted state:
  {
    xp: number,           // current month's XP total
    xpMonth: string,      // "YYYY-MM" of the month xp belongs to
  }
- Note: since this app has no backend/signup API, treat "brand new user" as
  "no dashboard data found in localStorage yet" — on that very first load,
  initialize xp to 100 (a one-time welcome gift) and xpMonth to the current
  month. This gift is NOT repeated on later monthly resets.
- Update StatsGrid.jsx to read xp from useDashboard() instead of user.xp.

### 3. Daily XP formula (goal closeness)
Compute today's earned XP live, same way `current` (today's studied hours)
already updates:

  dailyXP = round( min(current / target, 1) * 50 )

- 50 XP is the max earnable per day, awarded at 100%+ of the daily goal
- Below 100%, XP scales proportionally (e.g. 50% of goal = 25 XP)
- No bonus for exceeding the goal, capped at 50/day
- Display this as the "+X earned today" subtext under Total XP (reuse the
  existing "earned today" UI pattern already in StatsGrid)

### 4. Roll dailyXP into the monthly total
Hook this into the same "is this a new day" check already used for the
streak/hours-per-day reset in the earlier Daily Goal feature:
- When a new day is detected, take the PREVIOUS day's finalized dailyXP
  (computed from that day's final current/target ratio) and add it to `xp`
- Then check if the month has changed (compare today's "YYYY-MM" to the
  stored xpMonth) — if so, reset xp to 0 and update xpMonth BEFORE adding
  the new day's incoming dailyXP total for the new month

### 5. Make "Hours Studied" real, weekly, resetting
Add persisted state to DashboardContext.jsx:
  {
    hoursThisWeek: number,
    weekStart: string   // ISO date of the most recent Monday
  }
- On the same "new day" check, add the previous day's finalized `current`
  hours into hoursThisWeek
- Compute the Monday of the current week; if it differs from the stored
  weekStart, reset hoursThisWeek to 0 and update weekStart (this closes out
  the old week before today's hours start accumulating into the new one)
- In StatsGrid.jsx, replace the hardcoded "34h" with hoursThisWeek (format
  like "12h" or "12.5h"), and change the subtext from the fake "Top 15%
  this week" to something honest like "This week" (no invented ranking claim)

### Constraints
- Follow existing Tailwind v4 arbitrary-value syntax (bg-(--var), not bg-[var(--var)])
- Reuse the existing day-change detection logic already built for the
  Daily Goal & Streak feature — don't duplicate a second separate date-check
- Don't touch Notes, Quiz, Flashcards, Doubts, Files, or Active Groups data

## Feature Update: Goal Celebration, 7-Hour Bonus, Storage Abstraction

### Files involved
- src/contexts/DashboardContext.jsx
- src/pages/DashboardComponents/ (new component, e.g. GoalCelebration.jsx)
- src/services/ (new file, e.g. dashboardStorage.js)

### 1. Centralize storage access (backend-readiness prep)
Create src/services/dashboardStorage.js exporting simple functions like
`getDashboardData()` and `saveDashboardData(data)` that wrap
localStorage.getItem/setItem. Have DashboardContext.jsx call these instead
of touching localStorage directly. This is the ONLY change needed later to
swap in real API calls — don't touch any other file's logic for this reason,
just centralize the read/write calls.

### 2. Daily goal celebration (100%)
Add a state flag per day: { goalCelebrated: boolean, forDate: string }.
When current/target crosses 1.0 for the first time on a given day (not on
every re-render, and not again if already celebrated today), trigger a
short celebratory animation — confetti burst or a toast using the existing
Toast component (components/ui) — with a message like "Daily goal reached!".
Reset `goalCelebrated` to false at the same day-rollover point already used
elsewhere.

### 3. Seven-hour bonus (independent of daily goal %)
Add a state flag per day: { bonusClaimed: boolean, forDate: string }.
When `current` (today's studied hours) crosses 7 for the first time that
day, award a one-time +200 XP bonus directly onto that day's earned XP
(so it flows into the monthly `xp` total at the next day-rollover, same
as regular dailyXP). This bonus is separate from the 0–50 daily-goal-based
XP — don't cap it or blend it into that formula. Trigger a distinct,
more prominent celebration (e.g. bigger confetti / different toast copy
like "7-hour marathon! +200 XP") so it visually reads as a bigger deal
than the regular goal celebration.
Reset `bonusClaimed` to false at day-rollover, same as goalCelebrated.

### Constraints
- Follow existing Tailwind v4 arbitrary-value syntax (bg-(--var), not bg-[var(--var)])
- Reuse the existing day-change detection already built for streak/XP/hours
- Don't touch Notes, Quiz, Flashcards, Doubts, Files, or Active Groups data

## Feature Update: Functional AI Study Buddy (Groq API)

### Files involved
- .env (new, git-ignored — holds the API key)
- src/services/groqService.js (new)
- src/pages/DoubtsComponents/DoubtsRightSidebar.jsx

### 1. Environment setup
Create a .env file at the project root (add it to .gitignore if not already
covered by the existing `*.env` pattern) with:
  VITE_GROQ_API_KEY=paste_your_key_here
I will paste my own real key into this file myself after it's created —
leave the value as a placeholder in the code/instructions.

### 2. Groq service
Create src/services/groqService.js exporting an async function
`askStudyBuddy(question)` that:
- Sends a POST request to https://api.groq.com/openai/v1/chat/completions
- Uses the Authorization header: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
- Uses model "llama-3.1-8b-instant" (fast, good for quick concept explanations)
- System prompt: "You are a friendly, concise study assistant. Explain
  concepts clearly and briefly for a student studying for exams. Keep
  answers under 150 words unless asked for more detail."
- Returns the assistant's reply text, or throws a clear error if the
  request fails (bad key, rate limit, network error)

### 3. Expand into a larger panel on click
Currently the "AI Study Buddy" card in DoubtsRightSidebar.jsx is a small
static box. Change this:
- Clicking anywhere on the card header (the Sparkles icon + "AI Study
  Buddy" title) opens an expanded panel/modal — reuse the existing Modal
  component from components/ui if it supports a wide size, otherwise build
  a simple overlay
- The expanded panel must be at least 25% of the viewport width (use
  min-w-[25vw] or similar) and comfortably tall (at least 60vh) so answers
  are clearly readable — center it or dock it from the right, your choice,
  but it should NOT be the same tiny sidebar width as before
- Inside the expanded panel: a scrollable message history area (user
  questions and AI answers, visually distinguished like a simple chat),
  a text input at the bottom, and a send button
- Show a loading indicator (e.g. animated dots) while waiting for the
  Groq response
- On error (bad key, network failure), show a friendly inline error
  message in the chat area, not a crash
- Add a close button (X) to collapse back to the small sidebar card

### Constraints
- Follow existing Tailwind v4 arbitrary-value syntax (bg-(--var), not bg-[var(--var)])
- Don't touch Trending Topics, Top Solvers, or Live Activity sections in
  the same file
- Don't touch any other page's AI-related placeholder (e.g. the Study
  Room's "Ask AI" box) — this task is scoped to Doubts only