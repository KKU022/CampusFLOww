'use client';

import { CgpaCalculatorCard } from '@/components/academics/cgpa-calculator-card';
import { AttendanceManager } from '@/components/academics/attendance-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import type { SubjectAttendance } from '@/lib/types';
import { getInitialAttendance } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/icons';

export default function AcademicsPage() {
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSubjects(getInitialAttendance());
    setLoading(false);
  }, []);

  const handleAttendanceChange = (
    subjectName: string,
    action: 'attend' | 'miss'
  ) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) => {
        if (subject.name === subjectName) {
          const newAttended =
            action === 'attend' ? subject.attended + 1 : subject.attended;
          const newTotal = subject.total + 1;
          return { ...subject, attended: newAttended, total: newTotal };
        }
        return subject;
      })
    );
  };

  const handleAddSubject = (newSubjectName: string) => {
    if (newSubjectName.trim() === '') return;
    setSubjects((prev) => [
      ...prev,
      { name: newSubjectName, attended: 0, total: 0 },
    ]);
  };

  const handleResetSubject = (subjectName: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.name === subjectName ? { ...s, attended: 0, total: 0 } : s))
    );
  };

  const handleDeleteSubject = (subjectName: string) => {
    setSubjects((prev) => prev.filter((s) => s.name !== subjectName));
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">
        Academic Health
      </h1>
      <Tabs defaultValue="attendance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="cgpa">CGPA Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <AttendanceManager
            subjects={subjects}
            loading={loading}
            onAttendanceChange={handleAttendanceChange}
            onAddSubject={handleAddSubject}
            onResetSubject={handleResetSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        </TabsContent>
        <TabsContent value="cgpa">
          <CgpaCalculatorCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
