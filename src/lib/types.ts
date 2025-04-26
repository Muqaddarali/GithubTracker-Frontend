export type ContributionType = 'COMMIT' | 'PULL_REQUEST' | 'REVIEW';

export type User = {
  id: string;
  username: string;
  avatarUrl: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

export type Repository = {
  id: string;
  name: string;
  url: string;
  description?: string;
};

export type Contribution = {
  id: string;
  user: User;
  type: ContributionType;
  timestamp: string;
  description: string;
  url: string;
  linesAdded: number;
  linesRemoved: number;
  filesChanged: number;
  repository: Repository;
  details?: ContributionDetail[];
};

export type ContributionDetail = {
  id: string;
  filePath: string;
  linesAdded: number;
  linesRemoved: number;
};

export type LeaderboardEntry = {
  user: User;
  totalContributions: number;
  commits: number;
  pullRequests: number;
  reviews: number;
  linesAdded: number;
  linesRemoved: number;
};

export type StatsOverview = {
  totalContributions: number;
  totalCommits: number;
  totalPullRequests: number;
  totalReviews: number;
  totalLinesAdded: number;
  totalLinesRemoved: number;
  activeUsers: number;
};

export type FilterOptions = {
  startDate?: Date;
  endDate?: Date;
  users?: string[];
  types?: ContributionType[];
  search?: string;
  repository?: string;
};