import { motion } from 'framer-motion';
import { DashboardProvider } from '../contexts/DashboardContext';
import WelcomeHeader from './DashboardComponents/WelcomeHeader';
import GoalCelebration from './DashboardComponents/GoalCelebration';
import StatsGrid from './DashboardComponents/StatsGrid';
import QuickTodoWidget from './DashboardComponents/QuickTodoWidget';
import ContinueStudyingWidget from './DashboardComponents/ContinueStudyingWidget';
import ProductivityHeatmapWidget from './DashboardComponents/ProductivityHeatmapWidget';
import ActiveStudyRoomsWidget from './DashboardComponents/ActiveStudyRoomsWidget';
import UpcomingSessionsWidget from './DashboardComponents/UpcomingSessionsWidget';
import ActivityFeedWidget from './DashboardComponents/ActivityFeedWidget';
import SmartAIAssistantWidget from './DashboardComponents/SmartAIAssistantWidget';
import SmartNotificationsWidget from './DashboardComponents/SmartNotificationsWidget';
import LeaderboardMiniWidget from './DashboardComponents/LeaderboardMiniWidget';
import FocusWidget from './DashboardComponents/FocusWidget';
import { MagicBentoGrid, MagicBentoCard } from '../components/ui/MagicBento';

function DashboardContent() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <GoalCelebration />
      <WelcomeHeader />
      <StatsGrid />

      {/* Focus & AI Top Section */}
      <MagicBentoGrid className="flex flex-col lg:flex-row gap-6 mb-6">
        <MagicBentoCard className="w-full lg:w-1/3 p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden">
          <FocusWidget />
        </MagicBentoCard>
        <MagicBentoCard className="flex-1 p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden">
          <SmartAIAssistantWidget />
        </MagicBentoCard>
      </MagicBentoGrid>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <MagicBentoGrid className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (The Doing Zone) - 4/12 */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <QuickTodoWidget />
            </MagicBentoCard>
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <ContinueStudyingWidget />
            </MagicBentoCard>
          </div>

          {/* Middle Column (The People Zone) - 5/12 */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <ActiveStudyRoomsWidget />
            </MagicBentoCard>
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <UpcomingSessionsWidget />
            </MagicBentoCard>
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <ProductivityHeatmapWidget />
            </MagicBentoCard>
          </div>

          {/* Right Column (The Smart Zone) - 3/12 */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <SmartNotificationsWidget />
            </MagicBentoCard>
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <ActivityFeedWidget />
            </MagicBentoCard>
            <MagicBentoCard className="p-0 rounded-2xl bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) overflow-hidden flex-1">
              <LeaderboardMiniWidget />
            </MagicBentoCard>
          </div>
        </MagicBentoGrid>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}