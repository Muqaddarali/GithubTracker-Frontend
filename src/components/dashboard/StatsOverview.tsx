
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { GitPullRequestIcon, GitCommitIcon, EyeIcon, UsersIcon, FileTextIcon, AlertTriangleIcon } from 'lucide-react';
import { StatsOverview as StatsOverviewType } from '@/lib/types';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, className }) => (
  <Card className={`overflow-hidden ${className || ''}`}>
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-secondary/30">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface StatsOverviewProps {
  stats: StatsOverviewType;
  isLoading?: boolean;
}

const StatsOverviewComponent: React.FC<StatsOverviewProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-secondary rounded"></div>
                  <div className="h-6 w-12 bg-secondary rounded"></div>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <StatsCard 
        title="Total Commits" 
        value={stats.totalCommits.toLocaleString()} 
        icon={<GitCommitIcon className="h-5 w-5 text-gitpulse-commit" />}
      />
      <StatsCard 
        title="Pull Requests" 
        value={stats.totalPullRequests.toLocaleString()} 
        icon={<GitPullRequestIcon className="h-5 w-5 text-gitpulse-pr" />}
      />
      <StatsCard 
        title="Code Reviews" 
        value={stats.totalReviews.toLocaleString()} 
        icon={<EyeIcon className="h-5 w-5 text-gitpulse-review" />}
      />
      <StatsCard 
        title="Active Users" 
        value={stats.activeUsers.toLocaleString()} 
        icon={<UsersIcon className="h-5 w-5 text-primary" />}
      />
      <StatsCard 
        title="Lines Added" 
        value={stats.totalLinesAdded.toLocaleString()} 
        icon={<FileTextIcon className="h-5 w-5 text-green-500" />}
      />
      <StatsCard 
        title="Lines Removed" 
        value={stats.totalLinesRemoved.toLocaleString()} 
        icon={<AlertTriangleIcon className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
};

export default StatsOverviewComponent;
