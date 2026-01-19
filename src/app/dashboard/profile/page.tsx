'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase/auth';
import { watchUser, saveUser } from '@/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProfileData = {
  displayName?: string;
  email?: string;
  college?: string;
  branch?: string;
  semester?: string;
};

export default function ProfilePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>({});
  const [draft, setDraft] = useState<ProfileData>({});

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUid(u?.uid ?? null);
      setPhotoUrl(u?.photoURL ?? null);
      setProfile({
        displayName: u?.displayName ?? undefined,
        email: u?.email ?? undefined,
      });
      setDraft({
        displayName: u?.displayName ?? undefined,
        email: u?.email ?? undefined,
      });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const initials = (() => {
    const base = (draft.displayName || profile.displayName || profile.email || 'CF').trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? 'C';
    const second = parts[1]?.[0] ?? (parts[0]?.[1] ?? 'F');
    return `${first}${second}`.toUpperCase();
  })();

  useEffect(() => {
    if (!uid) return;

    const unsub = watchUser(uid, (data) => {
      const next: ProfileData = {
        displayName: typeof data?.displayName === 'string' ? (data.displayName as string) : undefined,
        college: typeof (data as any)?.college === 'string' ? (data as any).college : undefined,
        branch: typeof (data as any)?.branch === 'string' ? (data as any).branch : undefined,
        semester: typeof (data as any)?.semester === 'string' ? (data as any).semester : undefined,
      };

      setProfile((prev) => ({ ...prev, ...next }));
      setDraft((prev) => (editing ? prev : { ...prev, ...next }));
    });

    return () => unsub();
  }, [uid, editing]);

  const handleSave = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      await saveUser(uid, {
        displayName: (draft.displayName ?? '').trim(),
        college: (draft.college ?? '').trim(),
        branch: (draft.branch ?? '').trim(),
        semester: (draft.semester ?? '').trim(),
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details in one place.</p>
      </div>

      <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Profile Information</h2>
            <p className="text-sm text-muted-foreground mt-1">Name and basic account details.</p>
          </div>
          {!editing ? (
            <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={photoUrl ?? undefined} alt="Profile" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{profile.displayName || 'Student'}</p>
            <p className="text-sm text-muted-foreground">{profile.email ?? '—'}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">FULL NAME</p>
            {editing ? (
              <Input
                value={draft.displayName ?? ''}
                onChange={(e) => setDraft((p) => ({ ...p, displayName: e.target.value }))}
                className="mt-2"
                placeholder="Your name"
              />
            ) : (
              <p className="mt-2 text-sm font-medium">{profile.displayName ?? '—'}</p>
            )}
          </div>

          <div className="rounded-2xl border-2 border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">EMAIL</p>
            <p className="mt-2 text-sm font-medium">{profile.email ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold">Academic Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Saved from onboarding.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">COLLEGE</p>
            {editing ? (
              <Input
                value={draft.college ?? ''}
                onChange={(e) => setDraft((p) => ({ ...p, college: e.target.value }))}
                className="mt-2"
                placeholder="College name"
              />
            ) : (
              <p className="mt-2 text-sm font-medium">{profile.college ?? '—'}</p>
            )}
          </div>

          <div className="rounded-2xl border-2 border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">BRANCH</p>
            {editing ? (
              <Input
                value={draft.branch ?? ''}
                onChange={(e) => setDraft((p) => ({ ...p, branch: e.target.value }))}
                className="mt-2"
                placeholder="e.g., CSE"
              />
            ) : (
              <p className="mt-2 text-sm font-medium">{profile.branch ?? '—'}</p>
            )}
          </div>

          <div className="rounded-2xl border-2 border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground">SEMESTER</p>
            {editing ? (
              <Input
                value={draft.semester ?? ''}
                onChange={(e) => setDraft((p) => ({ ...p, semester: e.target.value }))}
                className="mt-2"
                placeholder="e.g., 3rd Semester"
              />
            ) : (
              <p className="mt-2 text-sm font-medium">{profile.semester ?? '—'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
