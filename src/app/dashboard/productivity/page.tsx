'use client';
import { FocusTimerCard } from "@/components/productivity/focus-timer-card";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";

export default function ProductivityPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tighter mb-2">Productivity Hub</h1>
                <p className="text-muted-foreground">AI-powered tools to help you study smarter.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FocusTimerCard />
                <LeaderboardCard />
            </div>
        </div>
    )
}
