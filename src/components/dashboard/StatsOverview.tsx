import React from 'react';
import { Card, CardContent} from '@/components/ui/card';
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

const safeFormat = (value: number | undefined): string => {
  return value !== undefined ? value.toLocaleString() : '0';
};

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

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">No Data</p>
                  <h3 className="text-2xl font-bold mt-1">0</h3>
                </div>
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-secondary/30">
                  {i % 6 === 0 ? <GitCommitIcon className="h-5 w-5" /> : 
                   i % 6 === 1 ? <GitPullRequestIcon className="h-5 w-5" /> :
                   i % 6 === 2 ? <EyeIcon className="h-5 w-5" /> :
                   i % 6 === 3 ? <UsersIcon className="h-5 w-5" /> :
                   i % 6 === 4 ? <FileTextIcon className="h-5 w-5" /> :
                   <AlertTriangleIcon className="h-5 w-5" />}
                </div>
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
        value={safeFormat(stats.totalCommits)} 
        icon={<GitCommitIcon className="h-5 w-5 text-gitpulse-commit" />}
      />
      <StatsCard 
        title="Pull Requests" 
        value={safeFormat(stats.totalPullRequests)} 
        icon={<GitPullRequestIcon className="h-5 w-5 text-gitpulse-pr" />}
      />
      <StatsCard 
        title="Code Reviews" 
        value={safeFormat(stats.totalReviews)} 
        icon={<EyeIcon className="h-5 w-5 text-gitpulse-review" />}
      />
      <StatsCard 
        title="Active Users" 
        value={safeFormat(stats.activeUsers)} 
        icon={<UsersIcon className="h-5 w-5 text-primary" />}
      />
      <StatsCard 
        title="Lines Added" 
        value={safeFormat(stats.totalLinesAdded)} 
        icon={<FileTextIcon className="h-5 w-5 text-green-500" />}
      />
      <StatsCard 
        title="Lines Removed" 
        value={safeFormat(stats.totalLinesRemoved)} 
        icon={<AlertTriangleIcon className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
};

export default StatsOverviewComponent;
