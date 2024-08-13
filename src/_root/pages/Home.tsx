import { useState, useEffect } from "react";
import { Loader } from "@/components/shared";
import { useGetRecentListings } from "@/lib/react-query/queries";
import ListingCard from "@/components/shared/ListingCard";
import Filters from "@/components/shared/Filters";
import GeminiChat from "@/components/shared/GeminiChat";
import { Listing } from '@/types';

interface FiltersProps {
  handleSearch: () => Promise<any>;
}

const Home = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchResults, setSearchResults] = useState<Listing[] | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const {
    data: listings = { total: 0, documents: [] },
    isLoading: isListingLoading,
    isError: isErrorListings,
  } = useGetRecentListings();

  const handleSearch = async (filters: FiltersProps) => {
    setIsSearchLoading(true);
    try {
      const results = await filters.handleSearch();
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching listings:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleGeminiChatResults = (results: Listing[]) => {
    console.log("Gemini Chat Results:", results); // Debugging log
    setSearchResults(results);
  };

  const listingsToDisplay: Listing[] = searchResults || listings.documents as Listing[];

  useEffect(() => {
    console.log("Listings to Display:", listingsToDisplay); // Debugging log
  }, [listingsToDisplay]);

  if (isErrorListings) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Find your Home</h2>
          {isListingLoading || isSearchLoading ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {listingsToDisplay.length === 0 ? (
                <p className="body-medium text-light-1">No listings available.</p>
              ) : (
                listingsToDisplay.map((listing: Listing) => (
                  <ListingCard key={listing.$id} Listing={listing} />
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      <div className={`home-creators ${showFilters || showChat ? "hidden" : "block"}`}>
        <Filters onSearch={handleSearch} />
        <GeminiChat onResults={handleGeminiChatResults} />
      </div>

      <button
        className="floating-icon"
        onClick={() => {
          setShowFilters(!showFilters);
          setShowChat(!showChat);
        }}
      >
        <img src="/assets/icons/filter.svg" alt="Toggle Filters and Chat" />
      </button>

      <div
        className={`filter-chat-container ${showFilters ? "show-filter" : "hide"} ${showChat ? "show-chat" : "hide"}`}
      >
        {showFilters && <Filters onSearch={handleSearch} />}
        {showChat && <GeminiChat onResults={handleGeminiChatResults} />}
      </div>
    </div>
  );
};

export default Home;