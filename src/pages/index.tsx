
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import StatsOverview from '@/components/dashboard/StatsOverview';
import Leaderboard from '@/components/dashboard/Leaderboard';
import SearchBar from '@/components/ui/SearchBar';
import FilterBar from '@/components/ui/FilterBar';
import { mockContributions, mockStats, mockUsers, mockLeaderboard, mockFilteredContributions } from '@/lib/mockData';
import { FilterOptions } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCwIcon } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Apply filters and search
  const filteredContributions = mockFilteredContributions({
    ...filters,
    search: searchQuery,
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">GitHub Contribution Tracker</h1>
          <p className="text-muted-foreground">
            Track and analyze contributions to your GitHub repositories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats cards */}
            <StatsOverview stats={mockStats} />

            {/* Filters and search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <SearchBar onSearch={setSearchQuery} />
              <div className="flex items-center gap-2">
                <FilterBar users={mockUsers} onFilterChange={setFilters} />
                <button 
                  onClick={handleRefresh} 
                  className={`p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCwIcon size={16} />
                </button>
              </div>
            </div>

            {/* Contribution feed */}
            <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="activity">Activity Feed</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="mt-6">
                <ActivityFeed contributions={filteredContributions} />
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="py-12 text-center text-muted-foreground">
                  <p>Detailed analytics dashboard coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar content */}
          <div className="space-y-6">
            <Leaderboard entries={mockLeaderboard} />
            
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-medium mb-4">Project Repository</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Repository</span>
                  <span className="font-medium">GitPulse</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Owner</span>
                  <span className="font-medium">example-org</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tracking</span>
                  <span className="text-xs bg-green-600/20 text-green-500 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Displaying mock data for demonstration. Connect to a GitHub repository to track real-time contributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;