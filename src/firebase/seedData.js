/**
 * Firestore Seed Data Script
 * 
 * Populates Firestore with initial demo data: rooms, doubts, files, etc.
 * 
 * Usage:
 *   1. Import this file from your browser console or a temp component
 *   2. Call: seedAll(userId) where userId is the current user's UID
 *   
 * This is a ONE-TIME script. It checks for existing data before writing.
 */

import {
  db,
  roomsRef,
  roomDoc,
  roomClassrooms,
  roomMembers,
  doubtsRef,
  filesRef,
  usersRef,
  createDocWithId,
  createDoc,
  fetchDoc,
} from './firestore';
import {
  doc,
  addDoc,
  getDocs,
  serverTimestamp,
  collection,
} from 'firebase/firestore';

// ─── SEED ROOMS ───
const SEED_ROOMS = [
  {
    id: 'room-cs2',
    name: 'Computer Science 2nd Year',
    category: 'Engineering',
    icon: '💻',
    tags: ['Algorithms', 'Java', 'Web Dev'],
    description: 'Main hub for 2nd-year CS students. Collaboration, notes, and survival.',
    memberCount: 245,
    memberIds: [],
    privacy: 'public',
    inviteCode: 'CS2Y26',
    classrooms: [
      { name: 'General Discussion', type: 'discussion', unread: 0, typing: [] },
      { name: 'DSA Practice', type: 'discussion', unread: 5, typing: [] },
      { name: 'Algorithm Notes', type: 'notes', activeCursors: 2 },
      { name: 'Live Lab Session', type: 'live', activeParticipants: 14 },
      { name: 'Project Alpha', type: 'project', pendingTasks: 3 },
    ],
  },
  {
    id: 'room-med',
    name: 'Medical Entrance Prep 2026',
    category: 'Medicine',
    icon: '🧬',
    tags: ['Biology', 'Chemistry', 'Mock Tests'],
    description: 'High-intensity prep group for medical entrance exams.',
    memberCount: 1024,
    memberIds: [],
    privacy: 'public',
    inviteCode: 'MED26P',
    classrooms: [
      { name: 'Biology Doubts', type: 'discussion', unread: 12, typing: [] },
      { name: 'Organic Chem Summary', type: 'notes', activeCursors: 5 },
      { name: 'Weekly Mock Test', type: 'quiz', activeParticipants: 84 },
    ],
  },
  {
    id: 'room-math',
    name: 'Calculus Survival Guide',
    category: 'Engineering',
    icon: '📐',
    tags: ['Math', 'Derivatives', 'Integration'],
    description: 'We suffer through multi-variable calculus together.',
    memberCount: 890,
    memberIds: [],
    privacy: 'public',
    inviteCode: 'CALC99',
    classrooms: [
      { name: 'Homework Help', type: 'discussion', unread: 24, typing: [] },
      { name: 'Formula Cheatsheets', type: 'notes', activeCursors: 12 },
    ],
  },
  {
    id: 'room-business',
    name: 'Startup Founders Club',
    category: 'Business',
    icon: '📈',
    tags: ['Entrepreneurship', 'Pitching', 'Finance'],
    description: 'Connect with future founders. Pitch practice and networking.',
    memberCount: 512,
    memberIds: [],
    privacy: 'public',
    inviteCode: 'START1',
    classrooms: [
      { name: 'Pitch Reviews', type: 'live', activeParticipants: 5 },
      { name: 'Financial Modeling', type: 'notes', activeCursors: 0 },
      { name: 'MVP Milestones', type: 'project', pendingTasks: 8 },
    ],
  },
  {
    id: 'room-design',
    name: 'UI/UX Design Portfolio',
    category: 'Arts & Design',
    icon: '✨',
    tags: ['Figma', 'Web Design', 'Critique'],
    description: 'Share your Figma links and get brutal, honest feedback.',
    memberCount: 340,
    memberIds: [],
    privacy: 'public',
    inviteCode: 'UIUX22',
    classrooms: [
      { name: 'Portfolio Reviews', type: 'live', activeParticipants: 2 },
      { name: 'Design Inspiration', type: 'discussion', unread: 0, typing: [] },
    ],
  },
  {
    id: 'room-cyber',
    name: 'Cybersecurity Capture The Flag',
    category: 'Engineering',
    icon: '🛡️',
    tags: ['Hacking', 'Networks', 'Security'],
    description: 'Practicing for upcoming CTF competitions.',
    memberCount: 150,
    memberIds: [],
    privacy: 'public',
    inviteCode: 'CTF404',
    classrooms: [
      { name: 'Team Alpha Sync', type: 'live', activeParticipants: 4 },
      { name: 'Vulnerability Checklist', type: 'project', pendingTasks: 12 },
    ],
  },
];

// ─── SEED DOUBTS ───
const SEED_DOUBTS = [
  {
    title: 'Why does quicksort have O(n²) worst case?',
    body: 'I understand the average case is O(n log n) due to balanced partitions, but my professor mentioned the worst case is O(n²). When exactly does this happen and how can we avoid it in practice?',
    author: { id: 'system', name: 'Sarah Chen', initials: 'SC' },
    category: 'DSA',
    tags: ['sorting', 'complexity', 'algorithms'],
    difficulty: 'intermediate',
    scope: 'global',
    upvotes: 24,
    downvotes: 2,
    viewCount: 156,
    isResolved: true,
    bestAnswerId: 'ans_001',
    answers: [
      {
        id: 'ans_001',
        author: { id: 'system', name: 'Marcus Lee', initials: 'ML' },
        body: 'The worst case happens when the pivot chosen is always the smallest or largest element, leading to maximally unbalanced partitions. Randomized pivot selection or median-of-three helps avoid this.',
        upvotes: 18, isBestAnswer: true, isVerified: true, replies: [],
        createdAt: '3h ago',
      },
    ],
  },
  {
    title: 'Difference between TCP and UDP with real-world examples?',
    body: 'I keep mixing up when to use TCP vs UDP. Can someone explain with actual use cases?',
    author: { id: 'system', name: 'Alex Rivera', initials: 'AR' },
    category: 'Coding',
    tags: ['networking', 'protocols', 'web'],
    difficulty: 'beginner',
    scope: 'global',
    upvotes: 42,
    downvotes: 1,
    viewCount: 312,
    isResolved: true,
    bestAnswerId: 'ans_003',
    answers: [
      {
        id: 'ans_003',
        author: { id: 'system', name: 'Jordan Kim', initials: 'JK' },
        body: 'TCP is like a phone call — reliable, ordered. UDP is like postcards — fast, no guarantee.\n\nTCP: Web browsing, email. UDP: Gaming, streaming, DNS.',
        upvotes: 35, isBestAnswer: true, isVerified: true, replies: [],
        createdAt: '1d ago',
      },
    ],
  },
  {
    title: 'What is the difference between CNN and RNN?',
    body: 'Starting my deep learning course and I\'m confused about when to use CNNs vs RNNs.',
    author: { id: 'system', name: 'Aisha Patel', initials: 'AP' },
    category: 'AI/ML',
    tags: ['deep-learning', 'neural-networks'],
    difficulty: 'beginner',
    scope: 'global',
    upvotes: 31,
    downvotes: 0,
    viewCount: 245,
    isResolved: false,
    bestAnswerId: null,
    answers: [],
  },
  {
    title: 'Newton\'s third law — why doesn\'t everything cancel out?',
    body: 'If every action has an equal and opposite reaction, why doesn\'t everything just stay still?',
    author: { id: 'system', name: 'Tom Baker', initials: 'TB' },
    category: 'Physics',
    tags: ['mechanics', 'forces'],
    difficulty: 'beginner',
    scope: 'global',
    upvotes: 56,
    downvotes: 3,
    viewCount: 420,
    isResolved: true,
    bestAnswerId: 'ans_006',
    answers: [
      {
        id: 'ans_006',
        author: { id: 'system', name: 'Dr. Lisa Wong', initials: 'LW' },
        body: 'The action and reaction forces act on DIFFERENT objects! Forces only cancel when acting on the SAME object.',
        upvotes: 48, isBestAnswer: true, isVerified: true, replies: [],
        createdAt: '8h ago',
      },
    ],
  },
  {
    title: 'Dynamic programming vs Greedy — when to use which?',
    body: 'I struggle to identify whether a problem needs DP or Greedy. What\'s the fundamental difference?',
    author: { id: 'system', name: 'Ryan Zhang', initials: 'RZ' },
    category: 'DSA',
    tags: ['dynamic-programming', 'greedy'],
    difficulty: 'advanced',
    scope: 'global',
    upvotes: 67,
    downvotes: 2,
    viewCount: 589,
    isResolved: false,
    bestAnswerId: null,
    answers: [],
  },
];

// ─── SEED FAKE USERS (for leaderboard) ───
const SEED_USERS = [
  { id: 'sys-sarah', name: 'Sarah Jenkins', xp: 12450, level: 25, streak: 45, solvedCount: 47, email: 'sarah@demo.edu', subjects: ['cs'], studyPreferences: ['early', 'group'] },
  { id: 'sys-alex', name: 'Alex Chen', xp: 11200, level: 22, streak: 30, solvedCount: 38, email: 'alex@demo.edu', subjects: ['cs', 'math'], studyPreferences: ['night', 'solo'] },
  { id: 'sys-marcus', name: 'Marcus Lee', xp: 10850, level: 21, streak: 25, solvedCount: 35, email: 'marcus@demo.edu', subjects: ['cs'], studyPreferences: ['night', 'group'] },
  { id: 'sys-emma', name: 'Emma Watson', xp: 9800, level: 19, streak: 18, solvedCount: 24, email: 'emma@demo.edu', subjects: ['literature', 'languages'], studyPreferences: ['early', 'group'] },
  { id: 'sys-priya', name: 'Priya Sharma', xp: 9400, level: 18, streak: 12, solvedCount: 22, email: 'priya@demo.edu', subjects: ['cs', 'physics'], studyPreferences: ['night', 'solo'] },
];

// ─── MAIN SEED FUNCTION ───

export async function seedAll(currentUserId) {
  console.log('🌱 Starting Firestore seed...');
  let seeded = 0;

  // 1. Seed fake users (for leaderboard)
  for (const u of SEED_USERS) {
    const existing = await fetchDoc(doc(usersRef, u.id));
    if (!existing) {
      await createDocWithId(doc(usersRef, u.id), {
        ...u,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`,
        onboardingCompleted: true,
      });
      seeded++;
      console.log(`  ✅ User: ${u.name}`);
    }
  }

  // 2. Seed rooms
  for (const room of SEED_ROOMS) {
    const { classrooms, ...roomData } = room;
    const existing = await fetchDoc(roomDoc(room.id));
    if (!existing) {
      await createDocWithId(roomDoc(room.id), {
        ...roomData,
        createdBy: 'system',
        createdAt: serverTimestamp(),
      });

      // Create classrooms as subcollection
      for (const cr of classrooms) {
        await addDoc(roomClassrooms(room.id), {
          ...cr,
          createdAt: serverTimestamp(),
        });
      }

      seeded++;
      console.log(`  ✅ Room: ${room.name} (${classrooms.length} classrooms)`);
    }
  }

  // 3. Seed doubts
  const existingDoubts = await getDocs(doubtsRef);
  if (existingDoubts.empty) {
    for (const doubt of SEED_DOUBTS) {
      await createDoc(doubtsRef, {
        ...doubt,
        lastActivityAt: serverTimestamp(),
      });
      seeded++;
      console.log(`  ✅ Doubt: ${doubt.title.substring(0, 40)}...`);
    }
  }

  console.log(`\n🎉 Seed complete! ${seeded} documents created.`);
  return seeded;
}

/**
 * Quick check: has the database been seeded already?
 */
export async function isSeedNeeded() {
  const existingRooms = await getDocs(roomsRef);
  return existingRooms.empty;
}
