import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface GitHubConnectorProps {
  onConnect: (owner: string, repo: string) => void;
  isLoading?: boolean;
}

const GitHubConnector: React.FC<GitHubConnectorProps> = ({ onConnect, isLoading = false }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!owner || !repo) {
      toast({
        title: "Missing information",
        description: "Please provide both repository owner and name",
        variant: "destructive",
      });
      return;
    }
    
    setConnecting(true);
    
    try {
      await api.post('/github/connect', { owner, repoName: repo });
      
      toast({
        title: "Successfully connected!",
        description: `Connected to ${owner}/${repo}`,
      });
      
      onConnect(owner, repo);
    } catch (error) {
      console.error('Error connecting to repository:', error);
      toast({
        title: "Connection failed",
        description: "Could not connect to the specified repository. Please check the repository details and try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GithubIcon className="h-5 w-5" />
          <span>Connect to GitHub Repository</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="owner" className="block text-sm font-medium mb-1">
              Repository Owner/Organization
            </label>
            <Input
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. facebook"
              disabled={connecting || isLoading}
            />
          </div>
          <div>
            <label htmlFor="repo" className="block text-sm font-medium mb-1">
              Repository Name
            </label>
            <Input
              id="repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g. react"
              disabled={connecting || isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={connecting || isLoading}>
            {connecting ? "Connecting..." : "Connect Repository"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GitHubConnector;
