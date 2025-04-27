
import  { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitCommitIcon, GitPullRequestIcon, EyeIcon } from 'lucide-react';
import { api, getContributions } from '@/lib/api';
import { User,} from '@/lib/types';

// Define an interface for contributor statistics
interface ContributorStats {
  id: string;
  commits: number;
  pullRequests: number;
  reviews: number;
}

const Team = () => {
  const [contributors, setContributors] = useState<User[]>([]);
  const [contributorStats, setContributorStats] = useState<Map<string, ContributorStats>>(new Map());
  const [owner, setOwner] = useState<string | null>(null);
  const [repo, setRepo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Get repository info from localStorage
    const storedOwner = localStorage.getItem('repoOwner');
    const storedRepo = localStorage.getItem('repoName');
    
    if (storedOwner && storedRepo) {
      setOwner(storedOwner);
      setRepo(storedRepo);
      fetchContributors(storedOwner, storedRepo);
    }
  }, []);
  
  const fetchContributors = async (owner: string, repo: string) => {
    setLoading(true);
    try {
      // Fetch contributors
      const contributorsResponse = await api.get(`/github/contributors/${owner}/${repo}`);
      setContributors(contributorsResponse.data as User[]);
      
      // Fetch contributions to calculate stats using the updated function that returns proper types
      const { contributions } = await getContributions(owner, repo);
      
      // Process contributions to calculate contributor stats
      const stats = new Map<string, ContributorStats>();
      
      if (Array.isArray(contributions)) {
        contributions.forEach(contribution => {
          const userId = contribution.user.id;
          
          if (!stats.has(userId)) {
            stats.set(userId, {
              id: userId,
              commits: 0,
              pullRequests: 0,
              reviews: 0
            });
          }
          
          const userStats = stats.get(userId)!;
          
          if (contribution.type === 'COMMIT') {
            userStats.commits += 1;
          } else if (contribution.type === 'PULL_REQUEST') {
            userStats.pullRequests += 1;
          } else if (contribution.type === 'REVIEW') {
            userStats.reviews += 1;
          }
        });
      }
      
      setContributorStats(stats);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get stats for a specific contributor
  const getContributorStats = (contributorId: string) => {
    const stats = contributorStats.get(contributorId);
    if (stats) {
      return stats;
    }
    
    // Return default stats if not found
    return {
      id: contributorId,
      commits: 0,
      pullRequests: 0,
      reviews: 0
    };
  };
  
  if (!owner || !repo) {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Team</h1>
          <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
            <p className="text-muted-foreground">Connect to a GitHub repository to view team information</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Team Members</h1>
        <p className="text-muted-foreground mb-6">
          Contributors to {owner}/{repo}
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Repository Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Loading contributors...</p>
              </div>
            ) : contributors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Commits</TableHead>
                    <TableHead>PRs</TableHead>
                    <TableHead>Reviews</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributors.map((contributor) => {
                    const stats = getContributorStats(contributor.id);
                    return (
                      <TableRow key={contributor.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={contributor.avatarUrl} alt={contributor.username} />
                            <AvatarFallback>{contributor.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{contributor.username}</TableCell>
                        <TableCell>{contributor.email || 'No email available'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <GitCommitIcon className="h-4 w-4 text-gitpulse-commit" />
                            <span>{stats.commits}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <GitPullRequestIcon className="h-4 w-4 text-gitpulse-pr" />
                            <span>{stats.pullRequests}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-4 w-4 text-gitpulse-review" />
                            <span>{stats.reviews}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p>No contributors found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Team;
