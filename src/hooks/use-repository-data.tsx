import { useState, useEffect } from 'react';
import { Contribution, LeaderboardEntry, StatsOverview } from '@/lib/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { mockStats, mockLeaderboard } from '@/lib/mockData';

export const useRepositoryData = () => {
  const [owner, setOwner] = useState<string | null>(null);
  const [repo, setRepo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<StatsOverview>(mockStats);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const { toast } = useToast();

  const fetchRepositoryData = async (owner: string, repo: string) => {
    setLoading(true);
    try {
      const contributionsResponse = await api.get(`/github/contributions/${owner}/${repo}`);
      if (contributionsResponse.data?.contributions) {
        setContributions(contributionsResponse.data.contributions);
        
        // Create real leaderboard data from contributions
        const contributorMap = new Map<string, {
          user: any,
          totalContributions: number,
          commits: number,
          pullRequests: number,
          reviews: number,
          linesAdded: number,
          linesRemoved: number
        }>();
        
        contributionsResponse.data.contributions.forEach((contribution: any) => {
          const userId = contribution.user.id;
          
          if (!contributorMap.has(userId)) {
            contributorMap.set(userId, {
              user: contribution.user,
              totalContributions: 0,
              commits: 0,
              pullRequests: 0,
              reviews: 0,
              linesAdded: 0,
              linesRemoved: 0
            });
          }
          
          const contributor = contributorMap.get(userId)!;
          contributor.totalContributions++;
          
          if (contribution.type === 'COMMIT') {
            contributor.commits++;
          } else if (contribution.type === 'PULL_REQUEST') {
            contributor.pullRequests++;
          } else if (contribution.type === 'REVIEW') {
            contributor.reviews++;
          }
          
          contributor.linesAdded += contribution.linesAdded || 0;
          contributor.linesRemoved += contribution.linesRemoved || 0;
        });
        
        const leaderboard = Array.from(contributorMap.values())
          .sort((a, b) => b.totalContributions - a.totalContributions);
          
        if (leaderboard.length > 0) {
          setLeaderboardData(leaderboard);
        }
      }
      
      const statsResponse = await api.get(`/github/stats/${owner}/${repo}`);
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching repository data:', error);
      toast({
        title: "Error fetching data",
        description: "Could not load repository data. Please try again later.",
        variant: "destructive",
      });
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedOwner = localStorage.getItem('repoOwner');
    const storedRepo = localStorage.getItem('repoName');
    
    if (storedOwner && storedRepo) {
      setOwner(storedOwner);
      setRepo(storedRepo);
      fetchRepositoryData(storedOwner, storedRepo);
    }
  }, []);

  const handleRefresh = () => {
    if (!owner || !repo) {
      toast({
        title: "No repository connected",
        description: "Please connect to a GitHub repository first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRefreshing(true);
    fetchRepositoryData(owner, repo).finally(() => {
      setIsRefreshing(false);
    });
  };

  const handleConnectRepo = (newOwner: string, newRepo: string) => {
    setOwner(newOwner);
    setRepo(newRepo);
    localStorage.setItem('repoOwner', newOwner);
    localStorage.setItem('repoName', newRepo);
    fetchRepositoryData(newOwner, newRepo);
  };

  return {
    owner,
    repo,
    loading,
    isRefreshing,
    contributions,
    stats,
    leaderboardData,
    handleRefresh,
    handleConnectRepo
  };
};
