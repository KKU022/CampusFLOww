import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ShieldAlert, Star } from 'lucide-react';
import type { User } from '@/lib/types';

type QuickStatsProps = {
  productivityScore: User['productivityScore'];
  cgpa: User['cgpa'];
};


export default function QuickStats({
  productivityScore,
  cgpa,
}: QuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CGPA</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cgpa.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Based on last semester
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
