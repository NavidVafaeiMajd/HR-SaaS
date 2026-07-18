import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { useEffect, useMemo, useState, useCallback } from "react";

type SearchInputProps<T extends Record<string, unknown>> = {
   data: T[];
   onFilter: (filtered: T[]) => void;
   onQueryChange?: (query: string) => void;
   searchableKeys?: (keyof T)[];
};

export function SearchInput<T extends Record<string, unknown>>({
   data,
   onFilter,
   onQueryChange,
   searchableKeys,
}: SearchInputProps<T>) {
   const [query, setQuery] = useState("");

   const filteredData = useMemo(() => {
      if (!query.trim()) return data;

      const lowerQuery = query.toLowerCase().trim();

      return data.filter((item) =>
         (searchableKeys ?? Object.keys(item)).some((key) => {
            const value = item[key as keyof T];
            if (value === null || value === undefined) return false;
            
            // Convert to string and search
            const stringValue = String(value).toLowerCase();
            return stringValue.includes(lowerQuery);
         })
      );
   }, [query, data, searchableKeys]);

   const handleFilter = useCallback((data: T[]) => {
      onFilter(data);
   }, [onFilter]);

   const handleQueryChange = useCallback((newQuery: string) => {
      setQuery(newQuery);
      if (onQueryChange) {
         onQueryChange(newQuery);
      }
   }, [onQueryChange]);

   useEffect(() => {
      handleFilter(filteredData);
      // Also notify parent about query changes
      if (onQueryChange) {
         onQueryChange(query);
      }
   }, [filteredData, handleFilter, query, onQueryChange]);

   return (
      <div className="relative w-full max-w-sm">
         {/* Icon */}
         <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

         {/* Input */}
         <Input
            type="text"
            placeholder="جستجو..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="indent-4 text-right"
         />
      </div>
   );
}
