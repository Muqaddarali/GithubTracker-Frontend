import React, { useState } from 'react';
import { Contribution } from '@/lib/types';
import ContributionCard from './ContributionCard';

interface ActivityFeedProps {
  contributions: Contribution[];
  isLoading?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ contributions, isLoading = false }) => {
  const [visibleCount, setVisibleCount] = useState(10);
  
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 10);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-secondary rounded-full"></div>
              <div>
                <div className="h-4 w-32 bg-secondary rounded"></div>
                <div className="h-3 w-24 bg-secondary/70 rounded mt-2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  const visibleContributions = contributions.slice(0, visibleCount);
  
  return (
    <div className="space-y-4">
      {visibleContributions.length > 0 ? (
        <>
          <div className="space-y-4">
            {visibleContributions.map(contribution => (
              <ContributionCard key={contribution.id} contribution={contribution} />
            ))}
          </div>
          
          {visibleCount < contributions.length && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={loadMore}
                className="px-4 py-2 text-sm text-primary border border-primary/30 rounded-md hover:bg-primary/10 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border border-dashed border-secondary rounded-lg">
          <p className="text-muted-foreground">No contributions found</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;