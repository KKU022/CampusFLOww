"use client";

import { CgpaCalculatorCard } from '@/components/academics/cgpa-calculator-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const assignmentItems = [
  { title: 'DBMS Mini Project', due: 'In 3 days', status: 'Pending' },
  { title: 'OS Lab Record', due: 'Next week', status: 'In Progress' },
  { title: 'Maths Quiz Prep', due: 'Tomorrow', status: 'Pending' },
];

const examItems = [
  { title: 'DBMS Internal', date: '24 Jan', time: '10:00 AM' },
  { title: 'OS Mid-Sem', date: '28 Jan', time: '2:00 PM' },
  { title: 'Maths Unit Test', date: '30 Jan', time: '9:00 AM' },
];

const marksItems = [
  { subject: 'DBMS', score: '78/100' },
  { subject: 'OS', score: '84/100' },
  { subject: 'Maths', score: '91/100' },
  { subject: 'CN', score: '76/100' },
];

export default function TrackerPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">
        Tracker
      </h1>
      <Tabs defaultValue="assignments">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 border border-white/60 backdrop-blur-xl shadow-[0_8px_20px_rgba(255,255,255,0.45)]">
          <TabsTrigger value="assignments">Assignment Tracker</TabsTrigger>
          <TabsTrigger value="exams">Exam Tracker</TabsTrigger>
          <TabsTrigger value="marks">Marks</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card className="bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <CardHeader>
              <CardTitle className="font-headline">Assignment Tracker</CardTitle>
              <CardDescription>Keep tabs on upcoming submissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignmentItems.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-lg border border-white/70 bg-white/60 backdrop-blur-md p-4">
                  <div>
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">Due: {item.due}</p>
                  </div>
                  <Badge className={item.status === 'In Progress'
                    ? 'bg-[#7c5cff] text-white'
                    : 'bg-[#efeaff] text-[#6a4df7]'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams">
          <Card className="bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <CardHeader>
              <CardTitle className="font-headline">Exam Tracker</CardTitle>
              <CardDescription>Upcoming exams at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {examItems.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-lg border border-white/70 bg-white/60 backdrop-blur-md p-4">
                  <div>
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.date} • {item.time}</p>
                  </div>
                  <Badge className="bg-[#ff6aa2] text-white">Scheduled</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks">
          <div className="space-y-6">
            <Card className="bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
              <CardHeader>
                <CardTitle className="font-headline">Marks</CardTitle>
                <CardDescription>Scores for your latest assessments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {marksItems.map((item) => (
                  <div key={item.subject} className="flex items-center justify-between rounded-lg border border-white/70 bg-white/60 backdrop-blur-md p-4">
                    <p className="font-semibold text-slate-800">{item.subject}</p>
                    <Badge className="bg-[#22c55e] text-white">{item.score}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <CgpaCalculatorCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
