import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Check, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Building2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../contexts/UserContext';

const GithubIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const XIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#1877F2"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function Signup() {
  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loginWithGithub, loginWithTwitter, loginWithFacebook, isLoggedIn, error: authError, clearError } = useUser();

  // Automatically navigate if user is already authenticated
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Sync auth context error
  useEffect(() => {
    if (authError) setError(authError);
  }, [authError]);

  // Form State
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [studyType, setStudyType] = useState('BTech');
  const [branch, setBranch] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [activeOtp, setActiveOtp] = useState('123456');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [resendMessage, setResendMessage] = useState('');
  const otpInputRefs = useRef([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let timerId;
    if (step === 'otp' && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [step, resendTimer]);

  // Password strength calculation
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthColors = ['bg-(--border-default)', 'bg-red-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];
  const currentStrengthColor = password ? strengthColors[strength] : strengthColors[0];

  // Step 1 Validation & Submission
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!college.trim()) newErrors.college = 'College/Institute name is required';
    if (!branch) newErrors.branch = 'Branch is required';
    if (!yearOfStudy) newErrors.yearOfStudy = 'Year of Study is required';
    if (!collegeId.trim() || !/\S+@\S+\.(edu|ac\.in|edu\.in)$/i.test(collegeId)) {
      newErrors.collegeId = 'Please enter a valid college ID (e.g. yourid@college.ac.in)';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms and Privacy Policy';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartSignup = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Generate demo OTP for verification
    setTimeout(() => {
      const generatedOtp = '123456';
      setActiveOtp(generatedOtp);
      setStep('otp');
      setResendTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setLoading(false);
    }, 600);
  };

  // OTP Input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      setOtpError('');
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleQuickFillOtp = () => {
    setOtpDigits(activeOtp.split(''));
    setOtpError('');
    otpInputRefs.current[5]?.focus();
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setResendTimer(30);
    setOtpError('');
    setResendMessage(`New code sent! Demo OTP: ${newCode}`);
    setTimeout(() => setResendMessage(''), 4000);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }
    if (enteredCode !== activeOtp) {
      setOtpError('Invalid OTP code. Please check the code or click Quick Fill.');
      return;
    }

    setVerifying(true);
    setOtpError('');
    if (clearError) clearError();

    try {
      await signup(collegeId, password, name);
      try {
        localStorage.setItem('ew_draft_signup', JSON.stringify({ name, college, studyType, branch, yearOfStudy, collegeId, email: collegeId }));
      } catch {
        // ignore storage error
      }
      navigate('/onboarding', { state: { name, college, studyType, branch, yearOfStudy, collegeId, email: collegeId } });
    } catch (err) {
      setOtpError(err.message || 'Firebase account creation failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    if (clearError) clearError();
    try {
      const user = await loginWithGoogle();
      if (user) navigate('/dashboard');
    } catch (err) {
      if (err?.message) setError(err.message);
    }
  };

  const handleGithubSignup = async () => {
    setError('');
    if (clearError) clearError();
    try {
      const user = await loginWithGithub();
      if (user) navigate('/dashboard');
    } catch (err) {
      if (err?.message) setError(err.message);
    }
  };

  const handleTwitterSignup = async () => {
    setError('');
    if (clearError) clearError();
    try {
      const user = await loginWithTwitter();
      if (user) navigate('/dashboard');
    } catch (err) {
      if (err?.message) setError(err.message);
    }
  };

  const handleFacebookSignup = async () => {
    setError('');
    if (clearError) clearError();
    try {
      const user = await loginWithFacebook();
      if (user) navigate('/dashboard');
    } catch (err) {
      if (err?.message) setError(err.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-(--bg-glass) backdrop-blur-2xl border border-(--border-strong) rounded-3xl p-8 shadow-(--shadow-xl) w-full max-w-md mx-auto relative overflow-hidden"
    >
      {step === 'details' ? (
        <>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors mb-6 group w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </button>

          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Create an account</h2>
            <p className="text-(--text-secondary) text-sm">Join the community and supercharge your study sessions.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStartSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">Full Name</label>
              <Input 
                icon={User} 
                type="text" 
                placeholder="Alex Chen" 
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                error={errors.name}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">College/Institute</label>
              <Input 
                icon={Building2} 
                type="text" 
                placeholder="NIT Rourkela" 
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  if (errors.college) setErrors(prev => ({ ...prev, college: '' }));
                }}
                error={errors.college}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">Type of Study</label>
              <select
                value={studyType}
                onChange={(e) => setStudyType(e.target.value)}
                className="w-full bg-(--bg-glass) border border-(--border-default) rounded-xl px-4 py-2.5 text-sm text-(--text-primary) outline-none focus:border-accent-500 transition-colors cursor-pointer"
              >
                {['BTech', 'BSc', 'BCA', 'MBBS', 'MBA', 'MCA', 'BE', 'MSc', 'MTech', 'PhD', 'Other'].map((opt) => (
                  <option key={opt} value={opt} className="bg-(--bg-elevated) text-(--text-primary)">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">Branch</label>
              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  if (errors.branch) setErrors(prev => ({ ...prev, branch: '' }));
                }}
                className={`w-full bg-(--bg-glass) border ${errors.branch ? 'border-red-500' : 'border-(--border-default)'} rounded-xl px-4 py-2.5 text-sm text-(--text-primary) outline-none focus:border-accent-500 transition-colors cursor-pointer`}
              >
                <option value="" disabled className="bg-(--bg-elevated) text-(--text-muted)">Select Branch</option>
                {[
                  'Computer Science', 
                  'Mechanical', 
                  'Electrical', 
                  'Electronics & Communication', 
                  'Civil', 
                  'Chemical', 
                  'IT', 
                  'Biotechnology', 
                  'Other'
                ].map((opt) => (
                  <option key={opt} value={opt} className="bg-(--bg-elevated) text-(--text-primary)">
                    {opt}
                  </option>
                ))}
              </select>
              {errors.branch && <p className="text-xs text-red-500 mt-1 pl-1">{errors.branch}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => {
                  setYearOfStudy(e.target.value);
                  if (errors.yearOfStudy) setErrors(prev => ({ ...prev, yearOfStudy: '' }));
                }}
                className={`w-full bg-(--bg-glass) border ${errors.yearOfStudy ? 'border-red-500' : 'border-(--border-default)'} rounded-xl px-4 py-2.5 text-sm text-(--text-primary) outline-none focus:border-accent-500 transition-colors cursor-pointer`}
              >
                <option value="" disabled className="bg-(--bg-elevated) text-(--text-muted)">Select Year of Study</option>
                {[
                  '1st Year', 
                  '2nd Year', 
                  '3rd Year', 
                  '4th Year', 
                  '5th Year', 
                  'Graduated'
                ].map((opt) => (
                  <option key={opt} value={opt} className="bg-(--bg-elevated) text-(--text-primary)">
                    {opt}
                  </option>
                ))}
              </select>
              {errors.yearOfStudy && <p className="text-xs text-red-500 mt-1 pl-1">{errors.yearOfStudy}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">College ID</label>
              <Input 
                icon={Mail} 
                type="email" 
                placeholder="yourid@college.ac.in" 
                value={collegeId}
                onChange={(e) => {
                  setCollegeId(e.target.value);
                  if (errors.collegeId) setErrors(prev => ({ ...prev, collegeId: '' }));
                }}
                error={errors.collegeId}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Input 
                  icon={Lock} 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  error={errors.password}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-(--text-muted) hover:text-(--text-primary) transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              <div className="mt-2 flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`flex-1 rounded-full transition-colors duration-300 ${password && level <= strength ? currentStrengthColor : 'bg-(--border-default)'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-(--text-muted) mt-1.5 flex items-center gap-1">
                {strength >= 3 ? <Check size={12} className="text-green-500" /> : <div className="w-1 h-1 rounded-full bg-(--text-muted) ml-1 mr-0.5" />}
                Must be at least 8 characters with numbers & symbols.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-1.5 ml-1">Confirm Password</label>
              <Input 
                icon={Lock} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                error={errors.confirmPassword}
                required 
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="mt-0.5 rounded border-(--border-default) bg-(--bg-glass) text-accent-500 focus:ring-0"
                />
                <span className="text-xs text-(--text-secondary) leading-snug">
                  I agree to the <Link to="/terms" className="text-accent-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-accent-500 hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1 pl-1">{errors.terms}</p>}
            </div>

            <div className="pt-3">
              <Button type="submit" loading={loading} className="w-full">
                Verify Email & Continue <ArrowRight size={16} />
              </Button>
            </div>
          </form>

          {/* Social Sign Up Buttons */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-(--border-default)"></div>
            <span className="text-xs text-(--text-muted) uppercase tracking-wider font-medium">Or sign up with</span>
            <div className="flex-1 h-px bg-(--border-default)"></div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            <button 
              type="button"
              onClick={handleGoogleSignup}
              aria-label="Sign up with Google"
              title="Google"
              className="relative overflow-hidden group flex items-center justify-center py-2.5 px-2 rounded-xl border border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong) hover:bg-white/5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            </button>
            <button 
              type="button"
              onClick={handleGithubSignup}
              aria-label="Sign up with GitHub"
              title="GitHub"
              className="relative overflow-hidden group flex items-center justify-center py-2.5 px-2 rounded-xl border border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong) hover:bg-white/5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <GithubIcon size={18} />
            </button>
            <button 
              type="button"
              onClick={handleTwitterSignup}
              aria-label="Sign up with X (Twitter)"
              title="X (Twitter)"
              className="relative overflow-hidden group flex items-center justify-center py-2.5 px-2 rounded-xl border border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong) hover:bg-white/5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <XIcon size={16} />
            </button>
            <button 
              type="button"
              onClick={handleFacebookSignup}
              aria-label="Sign up with Facebook"
              title="Facebook"
              className="relative overflow-hidden group flex items-center justify-center py-2.5 px-2 rounded-xl border border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong) hover:bg-white/5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <FacebookIcon size={18} />
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-(--text-secondary)">
            Already have an account?{' '}
            <Link to="/login" className="text-(--text-primary) font-semibold hover:underline">Log in</Link>
          </p>
        </>
      ) : (
        /* Step 2: OTP Verification UI */
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <button 
            type="button"
            onClick={() => setStep('details')} 
            className="flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors mb-6 group w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Edit details
          </button>

          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/15 border border-accent-500/30 flex items-center justify-center text-accent-500 mb-4">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-2xl font-bold mb-1">Verify Your Email</h2>
            <p className="text-sm text-(--text-secondary)">
              We sent a 6-digit OTP code to <span className="font-semibold text-(--text-primary)">{collegeId || 'your college ID'}</span>.
            </p>
          </div>

          {/* Demo OTP Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent-500" />
              <span className="text-xs text-(--text-primary) font-medium">
                Demo OTP: <code className="px-1.5 py-0.5 rounded bg-(--bg-elevated) font-mono text-sm font-bold text-accent-500">{activeOtp}</code>
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickFillOtp}
              className="text-xs font-semibold text-accent-500 hover:underline px-2 py-1 rounded bg-(--bg-glass)"
            >
              Quick Fill
            </button>
          </div>

          {resendMessage && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-2">
              <CheckCircle2 size={16} />
              {resendMessage}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* 6 Digit Inputs */}
            <div>
              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold font-mono bg-(--bg-glass) border border-(--border-default) focus:border-accent-500 rounded-xl text-(--text-primary) outline-none transition-colors"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={14} /> {otpError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-(--text-muted)">
              <span>Didn't receive code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`font-semibold flex items-center gap-1 transition-colors ${
                  resendTimer > 0
                    ? 'text-(--text-muted) cursor-not-allowed opacity-60'
                    : 'text-accent-500 hover:underline cursor-pointer'
                }`}
              >
                <RefreshCw size={12} className={resendTimer > 0 ? '' : 'animate-spin-slow'} />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </button>
            </div>

            <Button type="submit" loading={verifying} className="w-full">
              Verify & Complete Setup <ArrowRight size={16} />
            </Button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
}
