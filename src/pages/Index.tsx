
import React, { useState } from 'react';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import ResultsTable from '../components/ResultsTable';
import Footer from '../components/Footer';
import { mockTrips } from '../data/mockData';

interface Trip {
  id: string;
  date: string;
  time: string;
  departureZone: string;
  departureStation: string;
  arrivalZone: string;
  arrivalStation: string;
  trainRef: string;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<Trip[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Simulating a search operation
  const handleSearch = (criteria: any) => {
    // In a real app, this would be an API call with the criteria
    console.log("Search criteria:", criteria);
    
    // Simulate API delay
    setTimeout(() => {
      // Filter mock data based on criteria (simplified)
      let results = [...mockTrips];
      
      // Sort results by date and time
      results.sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) return dateComparison;
        return a.time.localeCompare(b.time);
      });
      
      // Limit to 50 results max
      results = results.slice(0, 50);
      
      setSearchResults(results);
      setHasSearched(true);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F6]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <SearchForm onSearch={handleSearch} />
        {hasSearched && <ResultsTable results={searchResults} />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
