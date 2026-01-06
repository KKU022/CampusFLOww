'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '../ui/badge';
import { Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

const issueFormSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  category: z.enum(['Room Cleaning', 'Electrical', 'Plumbing', 'Internet', 'Other'], {
      required_error: "Please select a category.",
  }),
  description: z.string().min(10, 'Please provide a detailed description (min. 10 characters).'),
});

type Issue = {
    id: number;
    roomNumber: string;
    category: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    date: string;
}

const initialIssues: Issue[] = [
    { id: 1, roomNumber: 'G-203', category: 'Electrical', description: 'The fan is not working. It makes a loud noise but does not spin.', status: 'Pending', date: '2024-07-29'},
    { id: 2, roomNumber: 'F-101', category: 'Room Cleaning', description: 'The room has not been cleaned for 3 days.', status: 'Resolved', date: '2024-07-27'},
]

const statusVariantMapping = {
    Pending: 'destructive',
    'In Progress': 'secondary',
    Resolved: 'default',
} as const;


export function HostelIssueTrackerCard() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof issueFormSchema>>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      roomNumber: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof issueFormSchema>) {
    const newIssue: Issue = {
        id: issues.length + 1,
        ...values,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
    }
    setIssues([newIssue, ...issues]);
    toast({
      title: 'Issue Reported!',
      description: 'Your issue has been submitted to the warden. You can track its status below.',
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Report an Issue</CardTitle>
        <CardDescription>
          Facing an issue in your room? Let the administration know.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., G-203" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an issue category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Room Cleaning">Room Cleaning</SelectItem>
                            <SelectItem value="Electrical">Electrical</SelectItem>
                            <SelectItem value="Plumbing">Plumbing</SelectItem>
                            <SelectItem value="Internet">Internet</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Please describe the issue in detail..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Issue</Button>
          </CardFooter>
        </form>
      </Form>
      <CardContent>
        <h3 className="font-headline text-lg font-semibold mb-4">Submitted Tickets</h3>
        <div className="space-y-4">
            {issues.map(issue => (
                <div key={issue.id} className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Ticket className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold">{issue.category} <span className="text-muted-foreground font-normal">({issue.roomNumber})</span></p>
                            <Badge variant={statusVariantMapping[issue.status]}>{issue.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{issue.date}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
