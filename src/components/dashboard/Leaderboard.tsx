
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommitIcon, GitPullRequestIcon, EyeIcon, TrophyIcon } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <span>Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-border animate-pulse">
              <div className="w-6 h-6 bg-secondary rounded-full"></div>
              <div className="w-8 h-8 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-secondary rounded w-24"></div>
                <div className="h-3 bg-secondary/60 mt-2 rounded w-32"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-12 bg-secondary rounded"></div>
                <div className="h-6 w-12 bg-secondary rounded"></div>
                <div className="h-6 w-12 bg-secondary rounded"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const topEntries = entries.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-yellow-500" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {topEntries.map((entry, index) => (
          <div key={entry.user.id} className="flex items-center gap-4 py-3 px-6 border-b last:border-0 border-border">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className={`text-sm font-semibold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                #{index + 1}
              </span>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={entry.user.avatarUrl} 
                alt={entry.user.username}
                className="h-8 w-8 rounded-full" 
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{entry.user.username}</p>
              <p className="text-xs text-muted-foreground">
                {entry.totalContributions} contributions
              </p>
            </div>
            <div className="hidden md:flex gap-6 text-sm">
              <div className="flex items-center gap-1">
                <GitCommitIcon className="h-4 w-4 text-gitpulse-commit" />
                <span>{entry.commits}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitPullRequestIcon className="h-4 w-4 text-gitpulse-pr" />
                <span>{entry.pullRequests}</span>
              </div>
              <div className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4 text-gitpulse-review" />
                <span>{entry.reviews}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;