'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

type Subject = {
  name: string;
  credits: number;
  gradePoints: number;
};

type Semester = {
  id: number;
  name: string;
  subjects: Subject[];
  sgpa: number | null;
};

export function CgpaCalculatorCard() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, name: 'Semester 1', subjects: [], sgpa: null },
  ]);
  const [nextSemId, setNextSemId] = useState(2);
  const [cgpa, setCgpa] = useState<number | null>(null);

  const handleSubjectChange = (semId: number, subIndex: number, field: keyof Subject, value: string | number) => {
    const newSemesters = [...semesters];
    const semester = newSemesters.find(s => s.id === semId);
    if (semester) {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        (semester.subjects[subIndex][field] as number) = numericValue;
        setSemesters(newSemesters);
        calculateSgpa(semId);
      }
    }
  };
  
  const handleSubjectNameChange = (semId: number, subIndex: number, value: string) => {
     const newSemesters = [...semesters];
    const semester = newSemesters.find(s => s.id === semId);
    if (semester) {
      semester.subjects[subIndex].name = value;
      setSemesters(newSemesters);
    }
  };

  const addSubject = (semId: number) => {
    const newSemesters = [...semesters];
    const semester = newSemesters.find(s => s.id === semId);
    if (semester) {
      semester.subjects.push({ name: `Subject ${semester.subjects.length + 1}`, credits: 0, gradePoints: 0 });
      setSemesters(newSemesters);
    }
  };
  
  const removeSubject = (semId: number, subIndex: number) => {
     const newSemesters = [...semesters];
    const semester = newSemesters.find(s => s.id === semId);
    if (semester) {
      semester.subjects.splice(subIndex, 1);
      setSemesters(newSemesters);
      calculateSgpa(semId);
    }
  }

  const addSemester = () => {
    setSemesters([...semesters, { id: nextSemId, name: `Semester ${nextSemId}`, subjects: [], sgpa: null }]);
    setNextSemId(nextSemId + 1);
  };
  
  const removeSemester = (semId: number) => {
    setSemesters(semesters.filter(s => s.id !== semId));
  }

  const calculateSgpa = (semId: number) => {
    const semester = semesters.find(s => s.id === semId);
    if (semester) {
      const totalCredits = semester.subjects.reduce((acc, sub) => acc + sub.credits, 0);
      const weightedGradePoints = semester.subjects.reduce((acc, sub) => acc + (sub.credits * sub.gradePoints), 0);
      const sgpa = totalCredits > 0 ? weightedGradePoints / totalCredits : null;
      
      const newSemesters = [...semesters];
      const semesterToUpdate = newSemesters.find(s => s.id === semId);
      if(semesterToUpdate) {
          semesterToUpdate.sgpa = sgpa;
          setSemesters(newSemesters);
      }
    }
  };

  const calculateCgpa = () => {
    const allSubjects = semesters.flatMap(s => s.subjects);
    const totalCredits = allSubjects.reduce((acc, sub) => acc + sub.credits, 0);
    const totalWeightedGradePoints = allSubjects.reduce((acc, sub) => acc + (sub.credits * sub.gradePoints), 0);
    const finalCgpa = totalCredits > 0 ? totalWeightedGradePoints / totalCredits : null;
    setCgpa(finalCgpa);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">CGPA Calculator</CardTitle>
        <CardDescription>
          Add your subjects, credits, and grade points for each semester to calculate your SGPA and overall CGPA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['semester-1']} className="w-full">
          {semesters.map((semester) => (
            <AccordionItem value={`semester-${semester.id}`} key={semester.id}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                  <span className="font-semibold">{semester.name}</span>
                  {semester.sgpa !== null && <Badge>SGPA: {semester.sgpa.toFixed(2)}</Badge>}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {semester.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Label htmlFor={`sem-${semester.id}-sub-${subIndex}-name`} className="sr-only">Subject Name</Label>
                        <Input
                          id={`sem-${semester.id}-sub-${subIndex}-name`}
                          placeholder="Subject Name"
                          value={subject.name}
                          onChange={(e) => handleSubjectNameChange(semester.id, subIndex, e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                         <Label htmlFor={`sem-${semester.id}-sub-${subIndex}-credits`} className="sr-only">Credits</Label>
                        <Input
                          id={`sem-${semester.id}-sub-${subIndex}-credits`}
                          type="number"
                          placeholder="Credits"
                          value={subject.credits || ''}
                          onChange={(e) => handleSubjectChange(semester.id, subIndex, 'credits', e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor={`sem-${semester.id}-sub-${subIndex}-gp`} className="sr-only">Grade Points</Label>
                        <Input
                          id={`sem-${semester.id}-sub-${subIndex}-gp`}
                          type="number"
                          placeholder="Grade Pts"
                          value={subject.gradePoints || ''}
                          onChange={(e) => handleSubjectChange(semester.id, subIndex, 'gradePoints', e.target.value)}
                          min="0"
                          max="10"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => removeSubject(semester.id, subIndex)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 justify-between">
                    <Button variant="outline" size="sm" onClick={() => addSubject(semester.id)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Subject
                    </Button>
                    {semesters.length > 1 && (
                        <Button variant="destructive" size="sm" onClick={() => removeSemester(semester.id)}>
                            Remove Semester
                        </Button>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="secondary" onClick={addSemester} className="mt-4 w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Semester
        </Button>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Button onClick={calculateCgpa}>Calculate CGPA</Button>
        {cgpa !== null && (
          <div className="text-2xl font-bold font-headline p-4 bg-accent/20 rounded-lg w-full text-center">
            Overall CGPA: <span className="text-accent-foreground">{cgpa.toFixed(2)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
