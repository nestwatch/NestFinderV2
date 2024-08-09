import { useState } from "react";
import { Loader } from "@/components/shared";
import { useGetRecentListings, useGetUsers } from "@/lib/react-query/queries";
import ListingCard from "@/components/shared/ListingCard";
import Filters from "@/components/shared/Filters";
import GeminiChat from "@/components/shared/GeminiChat";

const Home = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const {
    data: listings = { total: 0, documents: [] },
    isLoading: isListingLoading,
    isError: isErrorListings,
  } = useGetRecentListings();

  const {
    data: creators = { total: 0, documents: [] },
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorListings || isErrorCreators) {
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
          {isListingLoading ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {listings.documents.length === 0 ? (
                <p className="body-medium text-light-1">No listings available.</p>
              ) : (
                listings.documents.map((listing: any) => {
                  return <ListingCard key={listing.$id} Listing={listing} />;
                })
              )}
            </ul>
          )}
        </div>
      </div>

      <div className={`home-creators ${showFilters || showChat ? "hidden" : "block"}`}>
        <Filters />
        <GeminiChat />
      </div>

      {/* Floating Icon */}
      <button
        className="floating-icon"
        onClick={() => {
          setShowFilters(!showFilters);
          setShowChat(!showChat);
        }}
      >
        <img src="/assets/icons/filter.svg" alt="Toggle Filters and Chat" />
      </button>

      {/* Floating Filter and Chat */}
      <div
        className={`filter-chat-container ${showFilters ? "show-filter" : "hide"} ${showChat ? "show-chat" : "hide"}`}
      >
        {showFilters && <Filters />}
        {showChat && <GeminiChat />}
      </div>
    </div>
  );
};

export default Home;