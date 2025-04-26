import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { FilterIcon, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { FilterOptions, ContributionType, User } from '@/lib/types';
import { DateRange } from 'react-day-picker';

interface FilterBarProps {
  users: User[];
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ users, onFilterChange }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ContributionType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  
  const handleUserChange = (userId: string, checked: boolean) => {
    setSelectedUsers(prev => 
      checked 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };
  
  const handleTypeChange = (type: ContributionType, checked: boolean) => {
    setSelectedTypes(prev => 
      checked 
        ? [...prev, type]
        : prev.filter(t => t !== type)
    );
  };
  
  const applyFilters = () => {
    onFilterChange({
      users: selectedUsers.length > 0 ? selectedUsers : undefined,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      startDate: dateRange?.from,
      endDate: dateRange?.to
    });
  };
  
  const resetFilters = () => {
    setSelectedUsers([]);
    setSelectedTypes([]);
    setDateRange(undefined);
    onFilterChange({});
  };
  
  const contributionTypes: ContributionType[] = ['COMMIT', 'PULL_REQUEST', 'REVIEW'];
  
  const getContributionTypeLabel = (type: ContributionType) => {
    switch (type) {
      case 'COMMIT':
        return 'Commits';
      case 'PULL_REQUEST':
        return 'Pull Requests';
      case 'REVIEW':
        return 'Reviews';
    }
  };
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <FilterIcon size={14} />
            <span>Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">By User</h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`user-${user.id}`} 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => 
                        handleUserChange(user.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {user.username}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">By Type</h4>
              <div className="space-y-2">
                {contributionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`} 
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(checked) => 
                        handleTypeChange(type, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {getContributionTypeLabel(type)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2 flex items-center gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <CalendarIcon size={14} />
            <span>
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd")
                )
              ) : (
                "Date Range"
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range);
              if (range?.from && (range?.to || !range.to)) {
                onFilterChange({
                  ...{
                    users: selectedUsers.length > 0 ? selectedUsers : undefined,
                    types: selectedTypes.length > 0 ? selectedTypes : undefined,
                  },
                  startDate: range.from,
                  endDate: range.to,
                });
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterBar;
