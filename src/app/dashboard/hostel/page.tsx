'use client';

import { FoodMenuCard } from "@/components/hostel/food-menu-card";
import { HostelIssueTrackerCard } from "@/components/hostel/issue-tracker-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HostelPage() {
    return (
        <div className="space-y-6">
            <h1 className="font-headline text-3xl font-bold tracking-tighter">Hostel Life</h1>
            <Tabs defaultValue="menu" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="menu">Food Menu</TabsTrigger>
                    <TabsTrigger value="issues">Report an Issue</TabsTrigger>
                </TabsList>
                <TabsContent value="menu">
                    <FoodMenuCard />
                </TabsContent>
                <TabsContent value="issues">
                    <HostelIssueTrackerCard />
                </TabsContent>
            </Tabs>
        </div>
    )
}