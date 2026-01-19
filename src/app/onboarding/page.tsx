"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/auth';
import { saveUser, watchUser } from '@/firebase/firestore';

export default function OnboardingPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'academics'>('profile');

  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');

  const semesters = useMemo(
    () => ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'],
    []
  );

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUid(u?.uid ?? null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const unsub = watchUser(uid, (data) => {
      if (!data) return;

      const nextName = typeof data.displayName === 'string' ? data.displayName : '';
      const nextCollege = typeof (data as any).college === 'string' ? (data as any).college : '';
      const nextBranch = typeof (data as any).branch === 'string' ? (data as any).branch : '';
      const nextSemester = typeof (data as any).semester === 'string' ? (data as any).semester : '';

      if (nextName && !name) setName(nextName);
      if (nextCollege && !college) setCollege(nextCollege);
      if (nextBranch && !branch) setBranch(nextBranch);
      if (nextSemester && !semester) setSemester(nextSemester);
    });

    return () => unsub();
    // intentionally omit deps to avoid overwriting user's typing while they edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const validate = () => {
    if (!name.trim()) return 'Please enter your name.';
    if (!college.trim()) return 'Please enter your college name.';
    if (!branch.trim()) return 'Please enter your branch.';
    if (!semester.trim()) return 'Please select your semester.';
    return null;
  };

  const handleSave = async () => {
    setError(null);
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    const userId = uid ?? auth.currentUser?.uid ?? null;
    if (!userId) {
      setError('You must be signed in to continue.');
      return;
    }

    try {
      setSaving(true);
      await saveUser(userId, {
        onboarded: true,
        displayName: name.trim(),
        college: college.trim(),
        branch: branch.trim(),
        semester: semester.trim(),
      });
      router.push('/dashboard');
    } catch (e) {
      console.error('Failed to save onboarding profile', e);
      setError('Failed to save your details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setError(null);
    try {
      const userId = uid ?? auth.currentUser?.uid ?? null;
      if (userId) {
        await saveUser(userId, { onboarded: true });
      }
    } catch (e) {
      console.error('Failed to save onboarding flag', e);
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">Your Profile</h1>
          <p className="mt-2 text-slate-500">Set up your account basics so CampusFlow can personalize your experience.</p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 p-1 bg-white">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={
                activeTab === 'profile'
                  ? 'px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold'
                  : 'px-4 py-2 rounded-full text-slate-800 text-sm font-semibold hover:bg-slate-100'
              }
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academics')}
              className={
                activeTab === 'academics'
                  ? 'px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold'
                  : 'px-4 py-2 rounded-full text-slate-800 text-sm font-semibold hover:bg-slate-100'
              }
            >
              Academics
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 max-w-3xl mx-auto rounded-2xl border-2 border-slate-900 bg-white p-4">
            <p className="text-sm text-slate-900">{error}</p>
          </div>
        )}

        <div className="mt-6 max-w-3xl mx-auto space-y-6">
          {activeTab === 'profile' && (
            <section className="rounded-3xl border-2 border-slate-900 bg-white shadow-[0_10px_0_rgba(15,23,42,0.9)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <p className="text-sm text-slate-500 mt-1">Tell us a bit about you.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('academics')}
                  className="rounded-full border-2 border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition"
                >
                  Next
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border-2 border-slate-900 p-4">
                  <label className="block text-xs font-semibold text-slate-500">NAME</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-xl border-2 border-slate-900 px-3 py-2 text-sm"
                  />
                </div>
                <div className="rounded-2xl border-2 border-slate-900 p-4">
                  <label className="block text-xs font-semibold text-slate-500">COLLEGE</label>
                  <input
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="College / University name"
                    className="mt-2 w-full rounded-xl border-2 border-slate-900 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'academics' && (
            <section className="rounded-3xl border-2 border-slate-900 bg-white shadow-[0_10px_0_rgba(15,23,42,0.9)] p-6">
              <div>
                <h2 className="text-xl font-bold">Academic Information</h2>
                <p className="text-sm text-slate-500 mt-1">This helps us tailor suggestions and scheduling.</p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border-2 border-slate-900 p-4">
                  <label className="block text-xs font-semibold text-slate-500">BRANCH</label>
                  <input
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g., CSE"
                    className="mt-2 w-full rounded-xl border-2 border-slate-900 px-3 py-2 text-sm"
                  />
                </div>
                <div className="rounded-2xl border-2 border-slate-900 p-4">
                  <label className="block text-xs font-semibold text-slate-500">SEMESTER</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-900 px-3 py-2 text-sm"
                  >
                    <option value="">Select semester</option>
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="rounded-full border-2 border-slate-900 px-5 py-2.5 text-sm font-semibold hover:bg-slate-900 hover:text-white transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded-full border-2 border-slate-900 px-5 py-2.5 text-sm font-semibold hover:bg-slate-900 hover:text-white transition"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-slate-900 text-white px-6 py-2.5 text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Finish'}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
