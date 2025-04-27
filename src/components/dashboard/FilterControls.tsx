
import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import FilterBar from '@/components/ui/FilterBar';
import { RefreshCwIcon } from 'lucide-react';
import { User } from '@/lib/types';

interface FilterControlsProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  users: User[];
}

const FilterControls = ({
  onSearch,
  onFilterChange,
  onRefresh,
  isRefreshing,
  users
}: FilterControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <SearchBar onSearch={onSearch} />
      <div className="flex items-center gap-2">
        <FilterBar users={users} onFilterChange={onFilterChange} />
        <button 
          onClick={onRefresh} 
          className={`p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCwIcon size={16} />
        </button>
      </div>
    </div>
  );
};

export default FilterControls;
