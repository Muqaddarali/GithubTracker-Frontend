import  { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api, getRepositoryStats } from '@/lib/api';
import { StatsOverview, Contribution } from '@/lib/types';
import StatsOverviewComponent from '@/components/dashboard/StatsOverview';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface ContributorData {
  name: string;
  contributions: number;
}

interface ContributionsResponse {
  contributions: Contribution[];
  [key: string]: any;
}

const Analytics = () => {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [contributorData, setContributorData] = useState<ContributorData[]>([]);
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
      fetchData(storedOwner, storedRepo);
    }
  }, []);
  
  const fetchData = async (owner: string, repo: string) => {
    setLoading(true);
    try {
      // Fetch repository stats using the updated function that returns proper types
      const statsData = await getRepositoryStats(owner, repo);
      setStats(statsData);
      
      // Fetch contributions to calculate per-contributor stats
      const contributionsResponse = await api.get(`/github/contributions/${owner}/${repo}`);
      const responseData = contributionsResponse.data as ContributionsResponse;
      
      if (responseData && responseData.contributions) {
        const contributions = responseData.contributions;
        
        // Group contributions by user
        const contributorMap = new Map<string, { name: string; count: number }>();
        
        contributions.forEach(contribution => {
          const userId = contribution.user.id;
          const username = contribution.user.username;
          
          if (!contributorMap.has(userId)) {
            contributorMap.set(userId, { name: username, count: 0 });
          }
          
          const contributor = contributorMap.get(userId)!;
          contributor.count++;
        });
        
        // Convert map to array for the chart
        const chartData = Array.from(contributorMap.values())
          .map(c => ({ name: c.name, contributions: c.count }))
          .sort((a, b) => b.contributions - a.contributions)
          .slice(0, 10); // Take top 10 contributors
        
        setContributorData(chartData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!owner || !repo) {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Analytics</h1>
          <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
            <p className="text-muted-foreground">Connect to a GitHub repository to view analytics</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Analyzing contributor data for {owner}/{repo}
        </p>
        
        {stats && <StatsOverviewComponent stats={stats} isLoading={loading} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : contributorData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributorData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="contributions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No contribution data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contribution Types</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : stats ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Commits', value: stats.totalCommits || 0 },
                        { name: 'Pull Requests', value: stats.totalPullRequests || 0 },
                        { name: 'Reviews', value: stats.totalReviews || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Commits', value: stats.totalCommits || 0 },
                        { name: 'Pull Requests', value: stats.totalPullRequests || 0 },
                        { name: 'Reviews', value: stats.totalReviews || 0 }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
