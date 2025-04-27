
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface RepositoryInfoProps {
  owner: string;
  repo: string;
  loading: boolean;
}

const RepositoryInfo = ({ owner, repo, loading }: RepositoryInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-medium mb-4">Project Repository</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Repository</span>
            <span className="font-medium">{repo}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Owner</span>
            <span className="font-medium">{owner}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-xs bg-green-600/20 text-green-500 px-2 py-0.5 rounded-full">
              Connected
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading repository data..." : `Showing contribution data for ${owner}/${repo}.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepositoryInfo;