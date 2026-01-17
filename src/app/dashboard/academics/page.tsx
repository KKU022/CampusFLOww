"use client";

import { CgpaCalculatorCard } from '@/components/academics/cgpa-calculator-card';
import { AttendanceManager } from '@/components/academics/attendance-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimetableUploadCard } from '@/components/academics/timetable-upload-card';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAppContext } from '@/context/AppContext';

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
  const defaultTab = params?.get('tab') ?? 'attendance';

  return (
      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="cgpa">CGPA Calculator</TabsTrigger>
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
        <TabsContent value="cgpa">
          <CgpaCalculatorCard />
        </TabsContent>
        <TabsContent value="timetable-upload">
          <TimetableUploadCard />
        </TabsContent>
      </Tabs>
  );
}

export default function AcademicsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">
        Academic Health
      </h1>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <AcademicsContent />
      </Suspense>
    </div>
  );
}
