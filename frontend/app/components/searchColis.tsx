import React, { useState } from 'react';

interface SearchColisProps {
  onSearch: (origin: string) => void;
}

const SearchColis: React.FC<SearchColisProps> = ({ onSearch }) => {
  const [origin, setOrigin] = useState<string>('');

  const handleSearch = () => {
    onSearch(origin); // Appel de la fonction de recherche avec l'origine saisie
  };

  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Search by Origin"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        className="px-4 py-2 border rounded-lg w-full text-sm text-gray-700 focus:outline-none focus:border-purple-500"
      />
      <button
        onClick={handleSearch}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchColis;
