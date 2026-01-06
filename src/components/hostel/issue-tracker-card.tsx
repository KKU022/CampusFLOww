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
import { useToast } from "@/hooks/use-toast";
import { Badge } from '../ui/badge';
import { Ticket, Broom, Zap, Utensils, Wifi, WashingMachine, DoorOpen, Shield, Lightbulb, FileText, CreditCard, Wrench, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = {
    "Stay Services": [
        { name: "Cleanliness", icon: Broom },
        { name: "Electricity", icon: Zap },
        { name: "Food", icon: Utensils },
        { name: "Internet", icon: Wifi },
        { name: "Laundry", icon: WashingMachine },
        { name: "R&M (Room + CA)", icon: DoorOpen },
        { name: "Security", icon: Shield },
        { name: "Utilities", icon: Lightbulb },
    ],
    "Payment & Contract": [
        { name: "Contract Terms", icon: FileText },
        { name: "Payments & Billing", icon: CreditCard },
    ],
    "Others": [
        { name: "General", icon: Wrench },
        { name: "Complaint", icon: UserX }
    ]
} as const;

const allCategoryNames = Object.values(categories).flatMap(group => group.map(cat => cat.name));

const issueFormSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  category: z.enum(allCategoryNames, {
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
    { id: 1, roomNumber: 'G-203', category: 'Electricity', description: 'The fan is not working. It makes a loud noise but does not spin.', status: 'Pending', date: '2024-07-29'},
    { id: 2, roomNumber: 'F-101', category: 'Cleanliness', description: 'The room has not been cleaned for 3 days.', status: 'Resolved', date: '2024-07-27'},
]

const statusVariantMapping = {
    Pending: 'destructive',
    'In Progress': 'secondary',
    Resolved: 'default',
} as const;


export function HostelIssueTrackerCard() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof issueFormSchema>>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      roomNumber: '',
      description: '',
    },
  });

  function handleCategorySelect(category: z.infer<typeof issueFormSchema>['category']) {
    form.setValue('category', category);
    setShowForm(true);
  }

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
    setShowForm(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
            <CardTitle className="font-headline">Support</CardTitle>
            <Button variant="link"> <Ticket className='mr-2' /> Ticket History</Button>
        </div>
        {!showForm && 
            <CardDescription>
            Select a category to report an issue.
            </CardDescription>
        }
      </CardHeader>
      
      {!showForm ? (
         <CardContent>
            {Object.entries(categories).map(([groupName, groupCategories]) => (
                <div key={groupName} className="mb-8">
                    <h3 className="font-headline text-lg font-semibold mb-4">{groupName}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {groupCategories.map(({name, icon: Icon}) => (
                           <button 
                             key={name} 
                             onClick={() => handleCategorySelect(name)}
                             className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg shadow-sm hover:bg-accent hover:border-accent-foreground/20 transition-all text-center"
                           >
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                                <Icon className="h-6 w-6" />
                              </div>
                              <span className="text-sm font-medium">{name}</span>
                           </button>
                        ))}
                    </div>
                </div>
            ))}
        </CardContent>
      ) : (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle className="font-headline">Report: {form.getValues('category')}</CardTitle>
                 <CardDescription>
                    Please provide the details of your issue.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            <CardFooter className="gap-2">
                <Button type="submit">Submit Issue</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Back</Button>
            </CardFooter>
            </form>
        </Form>
      )}

      <CardContent>
        <h3 className="font-headline text-lg font-semibold my-4">Submitted Tickets</h3>
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
