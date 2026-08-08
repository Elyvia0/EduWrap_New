import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-(--bg-elevated) overflow-x-hidden text-(--text-primary)">
      {/* Animated Ambient Visual Background */}
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-20 pointer-events-none will-change-transform transform-gpu"
        style={{ background: 'oklch(0.58 0.22 calc(var(--accent-hue) + 60))' }}
      />
      <motion.div 
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20 pointer-events-none will-change-transform transform-gpu"
        style={{ background: 'oklch(0.60 0.18 calc(var(--accent-hue) - 30))' }}
      />

      <div className="relative z-10 w-full max-w-md my-auto py-8">
        {/* Branding Header above card */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_var(--accent-hue))] text-white flex items-center justify-center font-bold text-xl shadow-(--shadow-glow)">
            EW
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Your Study OS
          </h1>
          <p className="text-sm text-(--text-secondary)">
            Connect, study, and level up together.
          </p>
        </div>

        {/* Form Card */}
        <Outlet />
      </div>
    </div>
  );
}

