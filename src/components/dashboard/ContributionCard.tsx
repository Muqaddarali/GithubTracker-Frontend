
import React from 'react';
import { Contribution } from '@/lib/types';
import { Code2Icon, GitPullRequestIcon, EyeIcon, ArrowRightIcon, PlusIcon, MinusIcon, FileIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ContributionCardProps {
  contribution: Contribution;
}

const ContributionCard: React.FC<ContributionCardProps> = ({ contribution }) => {
  const { type, user, timestamp, description, linesAdded, linesRemoved, filesChanged } = contribution;
  
  const getIcon = () => {
    switch (type) {
      case 'COMMIT':
        return <Code2Icon className="h-5 w-5 text-gitpulse-commit" />;
      case 'PULL_REQUEST':
        return <GitPullRequestIcon className="h-5 w-5 text-gitpulse-pr" />;
      case 'REVIEW':
        return <EyeIcon className="h-5 w-5 text-gitpulse-review" />;
    }
  };
  
  const getContributionTypeStyle = () => {
    switch (type) {
      case 'COMMIT':
        return 'bg-gitpulse-commit/20 text-gitpulse-commit';
      case 'PULL_REQUEST':
        return 'bg-gitpulse-pr/20 text-gitpulse-pr';
      case 'REVIEW':
        return 'bg-gitpulse-review/20 text-gitpulse-review';
    }
  };
  
  const getContributionTypeText = () => {
    switch (type) {
      case 'COMMIT':
        return 'commit';
      case 'PULL_REQUEST':
        return 'pull request';
      case 'REVIEW':
        return 'code review';
    }
  };
  
  const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  
  return (
    <Card className="w-full animate-fade-in overflow-hidden transition-all duration-300 hover:shadow-md border-secondary/50 bg-card hover:border-primary/30">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <img 
                src={user.avatarUrl} 
                alt={user.username} 
                className="h-8 w-8 rounded-full"
              />
            </div>
            <div>
              <p className="font-medium">{user.username}</p>
              <span className="text-sm text-muted-foreground">{formattedTime}</span>
            </div>
          </div>
          <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getContributionTypeStyle())}>
            {getContributionTypeText()}
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="font-medium mb-2">{description}</p>
            
            {(type === 'COMMIT' || type === 'PULL_REQUEST') && (
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <FileIcon size={14} />
                  <span>{filesChanged} {filesChanged === 1 ? 'file' : 'files'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PlusIcon size={14} className="text-green-500" />
                  <span>{linesAdded}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MinusIcon size={14} className="text-red-500" />
                  <span>{linesRemoved}</span>
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="pl-0 mt-3 hover:bg-transparent hover:text-primary"
            >
              <a href={contribution.url} target="_blank" rel="noopener noreferrer">
                View on GitHub
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContributionCard;