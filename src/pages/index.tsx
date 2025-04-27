
import React, { useState } from 'react';
import Layout from '@/components/layout';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import StatsOverview from '@/components/dashboard/StatsOverview';
import Leaderboard from '@/components/dashboard/Leaderboard';
import GitHubConnector from '@/components/dashboard/GitHubConnector';
import FilterControls from '@/components/dashboard/FilterControls';
import RepositoryInfo from '@/components/dashboard/RepositoryInfo';
import { FilterOptions, Contribution } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers } from '@/lib/mockData';
import { useRepositoryData } from '@/hooks/use-repository-data';

const Index = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  const {
    owner,
    repo,
    loading,
    isRefreshing,
    contributions,
    stats,
    leaderboardData,
    handleRefresh,
    handleConnectRepo
  } = useRepositoryData();

  // Apply filters and search
  const filteredContributions = contributions.filter(contribution => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesDescription = contribution.description.toLowerCase().includes(query);
      const matchesUsername = contribution.user.username.toLowerCase().includes(query);
      
      if (!matchesDescription && !matchesUsername) {
        return false;
      }
    }
    
    // Apply type filter
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(contribution.type)) {
        return false;
      }
    }
    
    // Apply user filter
    if (filters.users && filters.users.length > 0) {
      if (!filters.users.includes(contribution.user.id)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">GitHub Contribution Tracker</h1>
          <p className="text-muted-foreground">
            Track and analyze contributions to your GitHub repositories
          </p>
        </div>

        {!owner || !repo ? (
          <div className="max-w-lg mx-auto my-12">
            <GitHubConnector onConnect={handleConnectRepo} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <StatsOverview stats={stats} isLoading={loading} />

              <FilterControls
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                users={mockUsers}
              />

              <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="activity">Activity Feed</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="mt-6">
                  <ActivityFeed contributions={filteredContributions} isLoading={loading} />
                </TabsContent>
                
                <TabsContent value="analytics">
                  <div className="py-12 text-center text-muted-foreground">
                    <p>Detailed analytics are available on the Analytics page</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar content */}
            <div className="space-y-6">
              <Leaderboard entries={leaderboardData} isLoading={loading} />
              <RepositoryInfo owner={owner} repo={repo} loading={loading} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
