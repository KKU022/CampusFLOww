
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase/auth";

type AuthFormType = "login" | "signup";

export default function LandingPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<AuthFormType>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Ensure providers are memoized to avoid re-instantiation
  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);
  const githubProvider = useMemo(() => new GithubAuthProvider(), []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = (type: AuthFormType) => {
    setFormType(type);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeAuthModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
    setError(null);
  };

  const toggleAuthForm = () => {
    setFormType((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  const handleAuthError = (e: unknown) => {
    const message = typeof e === "object" && e && "message" in e ? (e as any).message : "Something went wrong";
    setError(message);
  };

  const handleEmailPassword = async () => {
    setLoading(true);
    setError(null);
    try {
      if (formType === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      closeAuthModal();
      router.push("/dashboard");
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      closeAuthModal();
      router.push("/dashboard");
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, githubProvider);
      closeAuthModal();
      router.push("/dashboard");
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      closeAuthModal();
      router.push("/dashboard");
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      router.push("/");
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#060b1a] to-[#02040b] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-slate-950/40 pointer-events-none" />
      {/* Navigation */}
      <header className="relative max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold">
            CF
          </div>
          <div>
            <p className="text-sm text-slate-400">CampusFlow</p>
            <p className="font-semibold">AI Scheduler</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold shadow-[0_0_30px_rgba(59,130,246,0.5)] transition"
              >
                Get Started
              </button>
            </>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition disabled:opacity-60"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pb-12 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm w-fit">
            AI-powered scheduling
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
            Never miss a <span className="text-blue-400">deadline</span>.<br />Never waste a <span className="text-blue-400">free slot</span>.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            AI that transforms your scattered timetables, assignments, and grades into an optimized daily schedule. Built for students who want to work smarter, not harder.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openAuthModal("signup")}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold shadow-[0_0_30px_rgba(59,130,246,0.5)] transition"
            >
              Get Started
            </button>
            <button
              onClick={() => openAuthModal("login")}
              className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 transition"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl">
            <p className="text-sm text-blue-300 mb-2">Today&apos;s schedule</p>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 mb-4">
              <p className="text-slate-200 font-semibold">AI Suggests: Study Data Structures</p>
              <p className="text-slate-400 text-sm">Exam in 3 days • Low attendance</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 mb-4">
              <p className="text-slate-200 font-semibold">Performance</p>
              <p className="text-green-400 text-sm mt-1">▲ 12%</p>
              <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-blue-500" />
              </div>
              <p className="text-slate-400 text-xs mt-1">Current GPA • 8.4</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
              <p className="text-slate-200 font-semibold">Tasks Completed</p>
              <p className="text-slate-400 text-sm">23/30</p>
              <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[76%] bg-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {modalOpen && (
        <div id="authModal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
          <div className="relative w-[90%] max-w-md glass-card rounded-2xl border border-white/10 p-8 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <button
              aria-label="Close auth modal"
              className="absolute top-4 right-4 text-slate-300 hover:text-white"
              onClick={closeAuthModal}
            >
              ×
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">{formType === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="text-slate-400 text-sm mt-1">{formType === "login" ? "Sign in to continue to CampusFlow" : "Join to optimize your schedule"}</p>
            </div>

            {error && <div className="mb-3 text-red-400 text-sm text-center">{error}</div>}

            <div className="space-y-3" id={formType === "login" ? "loginForm" : "signupForm"}>
              <div>
                <label className="text-sm text-slate-300">Email</label>
                <input
                  className="w-full mt-1 rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Password</label>
                <input
                  className="w-full mt-1 rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500" />
                  Remember me
                </label>
                {formType === "login" && <button className="text-blue-400 hover:text-blue-300" type="button">Forgot password?</button>}
              </div>

              <button
                onClick={handleEmailPassword}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-lg transition disabled:opacity-60"
              >
                {formType === "login" ? "Sign In" : "Sign Up"}
              </button>

              <button
                onClick={handleGuestAccess}
                disabled={loading}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold text-lg transition disabled:opacity-60"
              >
                Continue as Guest
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs uppercase tracking-wider text-slate-500">or continue with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-lg font-semibold transition hover:bg-slate-100 disabled:opacity-60"
                >
                  <span>Google</span>
                </button>
                <button
                  onClick={handleGithubLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-lg font-semibold transition hover:bg-slate-100 disabled:opacity-60"
                >
                  <span>GitHub</span>
                </button>
              </div>

              <div className="text-center text-slate-400 text-sm mt-2">
                {formType === "login" ? (
                  <span>
                    Don&apos;t have an account? <button className="text-blue-400 hover:text-blue-300" onClick={toggleAuthForm}>Sign up</button>
                  </span>
                ) : (
                  <span>
                    Already have an account? <button className="text-blue-400 hover:text-blue-300" onClick={toggleAuthForm}>Sign in</button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
