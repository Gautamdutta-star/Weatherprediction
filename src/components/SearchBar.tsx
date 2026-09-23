import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCities } from '../utils/weatherData';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
  currentCity: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onCitySelect,
  currentCity,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search worldwide cities
  const handleInputChange = async (value: string) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    try {
      const cities = await searchCities(value.trim());

      setSuggestions(cities);
    } catch (error) {
      console.error('City search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Select city
  const handleCitySelect = (city: string) => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);

    onCitySelect(city);

    inputRef.current?.blur();
  };

  // Search on Enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      handleCitySelect(query.trim());
    }
  };

  return (
    <div
      className="relative w-full max-w-md"
      ref={dropdownRef}
    >
      {/* Search box */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (query.length > 1 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search any city in the world..."
          autoComplete="off"
          className="w-full pl-12 pr-12 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
        />

        {/* Loading icon */}
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white animate-spin" />
        )}
      </form>

      {/* Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-50 overflow-hidden">

          {loading ? (
            <div className="px-4 py-4 text-gray-600 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching worldwide cities...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-72 overflow-y-auto">

              {suggestions.map((city, index) => (
                <button
                  key={`${city}-${index}`}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center gap-3 text-gray-800 border-b border-gray-100 last:border-b-0"
                >
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />

                  <span className="truncate">
                    {city}
                  </span>
                </button>
              ))}

            </div>
          ) : query.length > 1 ? (
            <div className="px-4 py-4 text-gray-600">
              No city found. Try another city name.
            </div>
          ) : null}
        </div>
      )}

      {/* Current city */}
      <div className="flex items-center gap-2 mt-3 text-white/80">
        <MapPin className="w-4 h-4" />

        <span className="text-sm">
          Current: {currentCity}
        </span>
      </div>
    </div>
  );
};
