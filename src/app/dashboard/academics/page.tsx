"use client";

import { AttendanceManager } from '@/components/academics/attendance-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimetableUploadCard } from '@/components/academics/timetable-upload-card';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAppContext } from '@/context/AppContext';

import { useRouter } from 'next/navigation';

function AcademicsContent() {
  const { 
    subjects, 
    loading,
    updateSubjectAttendance,
    resetSubject,
    deleteSubject,
  } = useAppContext();

  const targetAttendance = 75;
  const params = useSearchParams();
  const tabParam = params?.get('tab') ?? 'attendance';
  const defaultTab = tabParam === 'cgpa' ? 'attendance' : tabParam;

  return (
      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="timetable-upload">Timetable Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <AttendanceManager
            subjects={subjects}
            loading={loading}
            onManualUpdate={updateSubjectAttendance}
            onReset={resetSubject}
            onDelete={deleteSubject}
            targetAttendance={targetAttendance}
          />
        </TabsContent>
        <TabsContent value="timetable-upload">
          <TimetableUploadCard />
        </TabsContent>
      </Tabs>
  );
}

export default function AcademicsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">
          Academic Health
        </h1>
        <button
          type="button"
          onClick={() => router.push('/dashboard/academics?tab=timetable-upload&open=1')}
          className="px-4 py-2 rounded-full border-2 border-slate-900 bg-white text-sm font-semibold hover:bg-slate-900 hover:text-white transition"
        >
          Upload Timetable
        </button>
      </div>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <AcademicsContent />
      </Suspense>
    </div>
  );
}
