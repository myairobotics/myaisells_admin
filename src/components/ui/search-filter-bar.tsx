import type { ReactNode } from 'react';
import { SearchInput } from './search-input';

type SearchFilterBarProps = {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
};

export function SearchFilterBar({ search, onSearch, placeholder = 'Search…', children }: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder={placeholder}
        className="min-w-48 flex-1"
      />
      {children}
    </div>
  );
}
