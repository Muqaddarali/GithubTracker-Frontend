
import { Contribution, ContributionType, LeaderboardEntry, StatsOverview, User } from './types';

export const mockUsers: User[] = [
  { 
    id: '1', 
    username: 'sarah_dev', 
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Dev&background=random', 
    email: 'sarah@example.com', 
    role: 'ADMIN' 
  },
  { 
    id: '2', 
    username: 'alex_coder', 
    avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Coder&background=random', 
    email: 'alex@example.com', 
    role: 'USER' 
  },
  { 
    id: '3', 
    username: 'taylor_tech', 
    avatarUrl: 'https://ui-avatars.com/api/?name=Taylor+Tech&background=random', 
    email: 'taylor@example.com', 
    role: 'USER' 
  },
  { 
    id: '4', 
    username: 'jamie_fullstack', 
    avatarUrl: 'https://ui-avatars.com/api/?name=Jamie+Fullstack&background=random', 
    email: 'jamie@example.com', 
    role: 'USER' 
  },
  { 
    id: '5', 
    username: 'morgan_qa', 
    avatarUrl: 'https://ui-avatars.com/api/?name=Morgan+QA&background=random', 
    email: 'morgan@example.com', 
    role: 'USER' 
  }
];

const generateMockContribution = (id: string, type: ContributionType, user: User, daysAgo: number): Contribution => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  
  const linesAdded = type === 'COMMIT' 
    ? Math.floor(Math.random() * 100) 
    : type === 'PULL_REQUEST' 
      ? Math.floor(Math.random() * 300) + 100 
      : 0;
  
  const linesRemoved = type === 'COMMIT' 
    ? Math.floor(Math.random() * 50) 
    : type === 'PULL_REQUEST' 
      ? Math.floor(Math.random() * 150) + 50 
      : 0;
  
  const filesChanged = type === 'COMMIT' 
    ? Math.floor(Math.random() * 5) + 1 
    : type === 'PULL_REQUEST' 
      ? Math.floor(Math.random() * 10) + 5 
      : 0;
  
  let description = '';
  if (type === 'COMMIT') {
    const commitMessages = [
      'Fix bug in authentication flow',
      'Add new feature for user profiles',
      'Update documentation',
      'Refactor database queries for better performance',
      'Fix typo in README',
      'Add unit tests for API endpoints',
      'Update dependencies to latest versions',
      'Improve error handling in user service',
    ];
    description = commitMessages[Math.floor(Math.random() * commitMessages.length)];
  } else if (type === 'PULL_REQUEST') {
    const prMessages = [
      'Feature: Implement user dashboard',
      'Bugfix: Resolve authentication issues',
      'Enhancement: Improve API performance',
      'Feature: Add notification system',
      'Documentation: Update API docs',
      'Refactor: Clean up authentication service',
    ];
    description = prMessages[Math.floor(Math.random() * prMessages.length)];
  } else {
    const reviewMessages = [
      'Approved with minor suggestions',
      'Requested changes to improve error handling',
      'Approved implementation',
      'Left comments about code style',
      'Suggested performance improvements',
      'Approved after addressing feedback',
    ];
    description = reviewMessages[Math.floor(Math.random() * reviewMessages.length)];
  }

  return {
    id,
    user,
    type,
    timestamp: date.toISOString(),
    description,
    url: `https://github.com/example/repo/commit/${id}`,
    linesAdded,
    linesRemoved,
    filesChanged,
    repository: {
      id: '1',
      name: 'GitPulse',
      url: 'https://github.com/example/GitPulse',
    }
  };
};

export const mockContributions: Contribution[] = [];

// Generate random contributions for the past 14 days
for (let i = 0; i < 50; i++) {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const type: ContributionType = ['COMMIT', 'PULL_REQUEST', 'REVIEW'][Math.floor(Math.random() * 3)] as ContributionType;
  const daysAgo = Math.floor(Math.random() * 14);
  mockContributions.push(generateMockContribution(`c${i}`, type, user, daysAgo));
}

// Sort by timestamp, newest first
mockContributions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const mockLeaderboard: LeaderboardEntry[] = mockUsers.map(user => {
  const userContributions = mockContributions.filter(c => c.user.id === user.id);
  const commits = userContributions.filter(c => c.type === 'COMMIT');
  const pullRequests = userContributions.filter(c => c.type === 'PULL_REQUEST');
  const reviews = userContributions.filter(c => c.type === 'REVIEW');
  
  return {
    user,
    totalContributions: userContributions.length,
    commits: commits.length,
    pullRequests: pullRequests.length,
    reviews: reviews.length,
    linesAdded: userContributions.reduce((sum, c) => sum + c.linesAdded, 0),
    linesRemoved: userContributions.reduce((sum, c) => sum + c.linesRemoved, 0),
  };
});

// Sort by total contributions, highest first
mockLeaderboard.sort((a, b) => b.totalContributions - a.totalContributions);

export const mockStats: StatsOverview = {
  totalContributions: mockContributions.length,
  totalCommits: mockContributions.filter(c => c.type === 'COMMIT').length,
  totalPullRequests: mockContributions.filter(c => c.type === 'PULL_REQUEST').length,
  totalReviews: mockContributions.filter(c => c.type === 'REVIEW').length,
  totalLinesAdded: mockContributions.reduce((sum, c) => sum + c.linesAdded, 0),
  totalLinesRemoved: mockContributions.reduce((sum, c) => sum + c.linesRemoved, 0),
  activeUsers: mockUsers.length,
};

export const mockFilteredContributions = (filters: any) => {
  let filtered = [...mockContributions];
  
  if (filters.users && filters.users.length > 0) {
    filtered = filtered.filter(c => filters.users.includes(c.user.id));
  }
  
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter(c => filters.types.includes(c.type));
  }
  
  if (filters.startDate) {
    filtered = filtered.filter(c => new Date(c.timestamp) >= filters.startDate);
  }
  
  if (filters.endDate) {
    filtered = filtered.filter(c => new Date(c.timestamp) <= filters.endDate);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(c => 
      c.description.toLowerCase().includes(searchLower) ||
      c.user.username.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};