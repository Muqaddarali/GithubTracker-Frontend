
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search contributions...', 
  initialValue = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-md">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-8"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
      <Button type="submit" variant="secondary" size="icon" className="ml-2">
        <Search size={16} />
      </Button>
    </form>
  );
};

export default SearchBar;
